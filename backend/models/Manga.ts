import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

class Comment {
    @prop({ required: true})
    public evaluation: number

    @prop()
    public content: string
}

class Cover {
    @prop()
    url: string

    @prop()
    alternativeText: string
}

@modelOptions({
    schemaOptions: {
      toJSON: { virtuals: true },
    }
  })
export class Manga {

    public get id() {
        return this._id.toHexString()
    }

    @prop()
    readonly cover: Cover;

    @prop({ required: true })
    readonly title: string;

    @prop({ required: true, min: 1})
    readonly number: number;

    @prop()
    readonly summary: string;

    @prop({ type: () => [String]})
    readonly chapters: string[];

    @prop({ required: true, min: 0.01, set: (v: number) => v, get: (v: number) => Number(v.toFixed(2))})
    readonly price: number;

    @prop({ type: () => [Comment]})
    private comments: Comment[] = [];
}

export const MangaRepository = getModelForClass(Manga)