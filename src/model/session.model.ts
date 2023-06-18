import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "./user.model";

export class Session{

  @prop({ref: () => User})
  user: Ref<User>;

  @prop({ref: () => User})
  valid: boolean;
}


const SessionModel = getModelForClass(Session,{
  schemaOptions: {
    timestamps: true,
  },
})

export default SessionModel;