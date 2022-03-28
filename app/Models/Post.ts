import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "../Models/User";
import Comment from "../Models/Comment";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public subject: string;

  @column()
  public content: string;

  @column()
  public slug: string;

  @column.dateTime()
  public publishAt: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>;
}
