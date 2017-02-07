import Role from '/imports/both/models/Role'
import User from '/imports/both/models/User'

function loadRoles() {
  if (Role.find().count() === 0) {
    const deanRole = new Role({ name: 'dean' })
    const secretaryRole = new Role({ name: 'secretary' })
    const technicianRole = new Role({ name: 'technician' })
    const teacherRole = new Role({ name: 'teacher' })
    const studentRole = new Role({ name: 'student' })
    const childRole = new Role({ name: 'child' })

    deanRole.save()
    secretaryRole.save()
    technicianRole.save()
    teacherRole.save()
    studentRole.save()
    childRole.save()

    const dean = Role.findOne({ name: 'dean' })
    const secretary = Role.findOne({ name: 'secretary' })
    const technician = Role.findOne({ name: 'technician' })
    const teacher = Role.findOne({ name: 'teacher' })
    const student = Role.findOne({ name: 'student' })
    const child = Role.findOne({ name: 'child' })

    // i don't know the real hierarchy just yet. lol
    dean.childIds.push(secretary._id)
    secretary.childIds.push(...[technician._id, teacher._id])
    teacher.childIds.push(student._id)
    student.childIds.push(child._id)

    dean.save()
    secretary.save()
    teacher.save()
    student.save()
  }
}

export default loadRoles
