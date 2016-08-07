#!/usr/bin/env python
# -*- coding: utf-8 -*-
import string
import sys
import os
from os import path


def _indent(s):
    return '\n'.join('    ' + line for line in str(s).splitlines()) + '\n\n'


class _PathGen(object):
    PATH_SUFFIX = '_PATH'
    BASE_SUFFIX = '_BASE'
    PROTO_SUFFIX = '_PROTO'
    META_SUFFIX = '_META'

    BASE_DIR_NAME = '_base_dir'
    _f = string.Formatter()

    def __call__(self, cls):
        self._generate_code(cls)

        g = {
            'join': path.join,
            'remove': os.remove,
            'exists': path.exists,
            'isfile': path.isfile,
            'isdir': path.isdir,
            'mkdir': os.makedirs,
        }
        exec self.code in g
        result = g[cls.__name__]
        try:
            result.__module__ = sys._getframe(1).f_globals.get('__name__', '__main__')
        except (AttributeError, ValueError):
            pass

        result.__generated_code__ = self.code
        del self.code
        return result

    def _generate_code(self, cls):
        self.code = (
            "class {}(object):\n"
            "    @staticmethod\n"
            "    def ensure_directory(directory_path):\n"
            "        if not isdir(directory_path):\n"
            "            if isfile(directory_path):\n"
            "                remove(directory_path)\n"
            "            mkdir(directory_path)\n"
            '\n'
            .format(cls.__name__)
        )
        found_paths = False
        for k, v in sorted(cls.__dict__.iteritems()):
            found_paths = True
            if k.endswith(self.PATH_SUFFIX):
                self._gen_for_path(k, v)

        if not found_paths:
            self.code += "    pass"

        return self.code

    def _gen_for_path(self, path_attribute, path_template):
        n = 60
        self.code += '    # ' + '=' * n + ' #\n'
        self.code += '    # {}'.format(path_attribute) + (' ' * (n - len(path_attribute))) + ' #\n'
        self.code += '    # ' + '=' * n + ' #\n'
        self._generate_raw_attribute(path_attribute, path_template)
        self._generate_property(path_attribute)
        self._generate_get_path_method(path_attribute, path_template)

        path_name = self._strip_suffix(path_attribute)

        if path_name.endswith(self.BASE_SUFFIX):
            self._generate_base(path_attribute, path_template)
        elif path_name.endswith(self.PROTO_SUFFIX):
            self._generate_proto(path_attribute, path_template)
        elif path_name.endswith(self.META_SUFFIX):
            self._generate_meta(path_attribute, path_template)

    def _generate_base(self, path_attribute, path_template):
        """ These are just directories, no CRUD necessary. """
        field_names = self._get_fields(path_template)
        code = (
            "def _ensure{path_name}({args}):\n"
            "    self.ensure_directory(self._get{path_attribute}({c_args}))\n"
            .format(
                path_attribute=path_attribute.lower(),
                path_name=self._strip_suffix(path_attribute).lower(),
                args=', '.join(['self'] + field_names),
                c_args=', '.join(field_names)
            )
        )

        self.code += _indent(code)

    def _generate_proto(self, path_attribute, path_template):
        """ These are the things that will ultimately have public CRUD """
        self._generate_crud(path_attribute, path_template)

    def _generate_meta(self, path_attribute, path_template):
        """ We might want internal CRUD for these? """
        self._generate_crud(path_attribute, path_template)

    def _get_fields(self, template):
        return [v[1] for v in self._f.parse(template) if v[1] is not None]

    def _strip_suffix(self, attr_name):
        return attr_name[:-len(self.PATH_SUFFIX)]

    def _generate_raw_attribute(self, path_attribute, path_template):
        self.code += _indent('{} = \'{}\''.format(path_attribute, path_template))

    def _generate_property(self, path_name):
        property_name = path_name.lower()
        code = (
            "@property\n"
            "def {}(self):\n"
            "    return join(self.{}, self.{})\n"
            .format(property_name, self.BASE_DIR_NAME, path_name)
        )
        self.code += _indent(code)

    def _generate_get_path_method(self, path_name, path_template):
        field_names = self._get_fields(path_template)
        method_name = '_get{}'.format(path_name.lower())
        code = (
            "def {}({}):\n"
            "    return self.{}.format(**locals())\n"
            .format(
                method_name,
                ', '.join(['self'] + field_names),
                path_name.lower()
            )
        )
        self.code += _indent(code)

    def _generate_crud(self, path_attribute, path_template):
        path_name = self._strip_suffix(path_attribute)
        c_args = self._get_fields(path_template)

        code = (
            'def _create{path_name}({self_c_args}):\n'
            '    """ Checks that the thing doesn\'t exist then returns a writeable file object for it. """\n'
            '    path = self._get{path_attribute}({c_args})\n'
            '    if not exists(path):\n'
            '        return open(path, \'wb\')\n'
            '    else:\n'
            '        return None\n'
            '\n'
            'def _read{path_name}({self_c_args}):\n'
            '    return open(self._get{path_attribute}({c_args}), \'rb\')\n'
            '\n'
            'def _update{path_name}({self_c_args}):\n'
            '    path = self._get{path_attribute}({c_args})\n'
            '    if exists(path):\n'
            '        return open(path, \'wb\')\n'
            '    else:\n'
            '        return None\n'
            '\n'
            'def _delete{path_name}({self_c_args}):\n'
            '    path = self._get{path_attribute}({c_args})\n'
            '    remove(path)\n'
            .format(
                path_name=path_name.lower(), path_attribute=path_attribute.lower(),
                c_args=', '.join(c_args), self_c_args=', '.join(['self'] + c_args)
            )
        )

        self.code += _indent(code)


@_PathGen()
class _TestClass(object):
    _USERS_BASE_PATH = 'users'
    _USER_BASE_PATH = path.join(_USERS_BASE_PATH, '{user_id}')
    _USER_PROTO_PATH = path.join(_USER_BASE_PATH, 'user.pb')
    _USER_META_PATH = path.join(_USER_BASE_PATH, 'meta.pb')
    _REGULARS_BASE_PATH = path.join(_USER_BASE_PATH, 'regulars')
    _REGULAR_BASE_PATH = path.join(_REGULARS_BASE_PATH, '{regular_id}')
    _REGULAR_PROTO_PATH = path.join(_REGULARS_BASE_PATH, '{seconds}_{nanos}.pb')

pathgen = _PathGen()


def main():
    pass

if __name__ == '__main__':
    main()
