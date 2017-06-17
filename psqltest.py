#!/usr/bin/env python
# -*- coding: utf-8 -*-
import matplotlib.pyplot as plt
import numpy as np
from perfectday import models as m, controllers as c, _populate_test_data  # noqa

m.main(['-D', 'postgres', '-u', 'kit'])

m.session.__enter__()

_populate_test_data.populate_db()

u = c.User.get(name='kitb')
u.recache_dates()

worths = list(u.calculate_worths_to(365))
print(worths)

plt.plot(np.cumsum(worths))
plt.show()
