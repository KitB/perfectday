import { HabitRecord } from 'Store/Ducks/Habits'

export const locationHabit = (state) => {
    const rawId = state.router.params.id
    const id = (rawId === 'new') ? rawId : Number(rawId)
    const habit = state.pd.habits.get(id) || new HabitRecord()
    return {habit: habit}
}

export const prospectiveHabit = (state) => ({
    habit: state.pd.prospectiveHabit,
})
