import { Types } from "mongoose"

export type TCourse ={
    title: string,
    description: string,
    categoryId:Types.ObjectId,
    categoryName: string,   
    video: string,
    ratings: number,
    reviews: number,
    viewCount: number
    isDeleted: boolean
}