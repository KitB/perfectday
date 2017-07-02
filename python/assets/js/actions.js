export const SET_HABITS = 'SET_HABITS'

export function setHabits(habits) {
    return {
        type: SET_HABITS,
        payload: {
            habits: habits,
        },
    }
}

export const SET_ME = 'SET_ME'

export function setMe(me) {
    return {
        type: SET_ME,
        payload: me,
    }
}
