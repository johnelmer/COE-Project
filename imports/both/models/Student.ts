import SetupCollection from '../decorators/SetupCollection'

import Model from './Model'

@SetupCollection('Students')
class Student extends Model{

    constructor(doc){
        super(doc)
    }

    changeStatus(status: string){
        Student.update(this._id, { $set: {status: status}})
    }

    changeAsGraduatingStudent(){
        Student.update(this._id, { $set: {isGraduating: true}})
    }

/* //no class record yet
    addClassRecord(classRecordId){
        
    }
*/
}