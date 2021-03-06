The point of the service is to attach a user's real-world *spending* to a value
they earn.

Limit options:
 * "I want to earn x <game currency> per perfect <unit time>"
   - e.g. "In a perfect day I should earn 20 gil"
   - or   "In a perfect (calendar?) month I should earn 600 gil"
 * "I want it to take n perfect days to earn x <game currency>
 * Perhaps a perfect day is the currency?

Currency = Perfect Day = pd; should stylise nicely (good symmetry) ρ (Rho) for
it? Would probably bother people who know to pronounce it as an R?  Makes the
goal obvious, possibly provides branding ideas.

Data storage design wants to keep a full history of the user so we can generate
graphs, because a big important part of it for me is tracking/"quantified self"
stuff

A task the user is to perform each day (or every n days etc), succeeding gives a
portion of that day's pd

important design choice: does failing lose any pd?

I want to allow the player a way to earn reprieves occasionally, if the
consequence of failure is loss of pd then they can't just cost pd, or generally
be tied to pd. Perhaps RWC (Real World Currency)? Or maybe they earn them for
good behaviour? Streaks? Want to encourage them not to take a day off too,
though. Maybe there's a bonus for ignoring a day off?

Clarification: a reprieve is probably just a lack of penalisation, not a "free
pd". That is to say: if you activate a reprieve, it wouldn't, say, give you all
of the reward for a day without having to do anything, it would simply mean you
don't lose anything for any failures that day. It's a "skip a day" not a "have a
day for free"

Should actually be called "Regular", perhaps?

Performing all regulars in a given day will always provide 1pd, you cannot get
more than 1pd for regulars per day.

This means non-daily regulars are just calculated as normal but only on the days
they "exist".

I have no intention of allowing for sub-daily regulars. A regular will happen at
most once per day.

Oh but it might be psychologically effective to have something about a perfect
week etc

Not just as a "7 perfect days", but more like "showered 3 times, washed clothes,
changed sheets, vacuumed flat"

Would still earn pd, maybe 2pd over a week for the weeklies?

Or maybe should just assign them a day of the week and make them the same as
standard Regulars?

Flexibility is probably healthier in the long run, while setting a day and
sticking to it is likely to work on me for forming the habit.

Want a way to say "*doesn't* happen every 7 days", for e.g. "you're allowed
takeaway every saturday"

Preferable to say I'm allowed it once a week though.

Key point is, there are bad habits that want breaking, those want to be given
"allowed" days, rather than "required" days. Managing not to do a thing on a
non-allowed day rewards you with the standard portion of pd based on weight.

A task the user needs to get done just once, e.g. "send that letter", "start
saving money", "make an appointment to get your foot looked at by a doctor"
