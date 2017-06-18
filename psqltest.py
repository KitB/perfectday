#!/usr/bin/env python
# -*- coding: utf-8 -*-
import matplotlib.pyplot as plt
import numpy as np
from perfectday import records as r, controllers as c, _populate_test_data  # noqa

r.main(['-D', 'postgres', '-u', 'kit'])

r.session.__enter__()

_populate_test_data.populate_db()

u = c.User.get(name='kitb')
u.recache_dates()

worths = list(u.calculate_worths_to(365))
print(worths)

plt.plot(np.cumsum(worths))
plt.show()
