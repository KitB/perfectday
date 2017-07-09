class PerfectDay {
    constructor(client, schema) {
        this.client = client
        this.schema = schema
    }

    action(path, args) {
        return this.client.action(this.schema, path, args)
    }

    getPerson(id) {
        return this.action(['people', 'read'], {id: id})
    }

    whoami() {
        return this.getPerson('me')
    }

    listHabits(person) {
        return this.action(['habits', 'list'], {person: person})
    }

    updateHabit(habit) {
        return this.action(['habits', 'update'], habit)
    }

    newHabit(habit) {
        console.log(habit)
        return this.action(['habits', 'create'], habit)
    }

    doHabit(habit) {
        return this.action(['actions', 'create'], {habit: habit.url, when: 0})
    }

    undoHabit(habit) {
        return this.action(['actions', 'delete'], {id: habit.today_action_id})
    }
}

export default PerfectDay
