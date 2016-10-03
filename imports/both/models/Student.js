import SetupCollection from '../decorators/SetupCollection'

import Model from './Model'
import Course from './Course'

@SetupCollection('Students')
class Student extends Model{

    addClassRecord(classRecordId){
        //To be implemented
    }

    addConsultation(consultationId){
        //To be implemented
    }

    get classRecords(){
        //To be implemented
    }

    get consultations(){
        //To be implemented
    }

    static setSchema(){
        const coursesDoc = Course.find()
        let coursesList = []
        coursesDoc.forEach(course => coursesList += course.name)
        this.constructor.attachSchema(new SimpleSchema({
            firstName:{
                type: String
            },
            lastName:{
                type: String,
                optional: false
            },
            middleInitial:{
                type: String,
                max: 3
            },
            gender:{
                type: String,
                allowedValues: [
                    "Male",
                    "Female"
                ]
            },
            course:{
                type: String,
                allowedValues: coursesList
            },
            birthDate:{
                type: Date
            },
            mobileNumber:{
                type: String,
                min:11,
                max:11,
                regEx: /^(09)\\d{9}/
            },
            isGraduating:{
                type: Boolean
            },
            classRecords:{
                type: [String]
            },
            consultations:{
                type: [String]
            },
            "guardian.fullName":{
                type: String,
                min: 4
            },
            "guadian.mobileNumber":{
                type: String,
                min: 11,
                max: 11,
                regEx: /^(09)\\d{9}/
            },
            status:{
                type: String,
                allowedValues: [
                    "active",
                    "shifted"
                ]
            },
            dateRegistered:{
                type: Date
            }

        }))
    }

}