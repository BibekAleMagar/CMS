import { Case } from "src/modules/case/entities/case.entity";
import { CaseDocument } from "src/modules/documents/entities/document.entity";
import { Appointment } from "src/modules/appointment/entities/appointment.entity";
import { ActivityLog } from "src/modules/activity/entities/activity.entity";
import { User } from "src/modules/user/entities/user.entity";

const entities = [User, Case, CaseDocument, Appointment, ActivityLog];


export default entities;

