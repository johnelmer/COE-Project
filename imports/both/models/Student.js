import SetupCollection from '../decorators/SetupCollection'

import Model from './Model'

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

    setup(){
        this.constructor.attachSchema(new SimpleSchema({
            firstName:{
                type: String
            },
            lastName:{
                type: String
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
                allowedValues: [
                    "BSSE",
                    "BSEE",
                    "BSECE",
                    "BSChE",
                    "BSCE",
                    "BSPkgE",
                    "BSME"
                ]
            },
            birthDate:{
                type: Date
            },
            mobileNumber:{ //need some RegEx here
                type: String,
                min:11,
                max:11
            },
            isGraduating:{
                type: Boolean
            },
            classRecords:{
                type: [Object]
            },
            consultations:{
                type: [Object]
            },
            "guardian.fullName":{
                type: String,
                min: 4
            },
            "guadian.mobileNumber":{
                type: String,
                min: 11,
                max: 11
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