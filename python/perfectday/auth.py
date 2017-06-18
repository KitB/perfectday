#!/usr/bin/env python
# -*- coding: utf-8 -*-
from passlib.context import CryptContext

context = CryptContext(schemes='argon2')

hash_pass = context.hash
verify_pass = context.verify
pass_needs_update = context.needs_update
verify_and_update = context.verify_and_update
