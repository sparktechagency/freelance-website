import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { access, unlink } from 'fs/promises';
import { deleteFromS3,  uploadToS3 } from '../../utils/s3';
import { TBlog } from './blog.interface';
import { Blog, BlogSection } from './blog.model';

const createBlog = async (files: any, payload: TBlog) => {
  try {

    payload.subBlogSections = JSON.parse(payload.subBlogSections as any);

    if(files.blogImage && files.blogImage.length > 0) {
      payload.image = files.blogImage[0].path.replace(/^public[\\/]/, '');
    }

   if (payload?.subBlogSections && payload?.subBlogSections.length > 0) {
     payload?.subBlogSections?.map((section: any) => {
      files?.blogSectionImages?.map((file: any) => {
        console.log('file.originalname', file.originalname);
        if (section.image1 && section.image1 === file.originalname) {
          section.image1 = file.path.replace(/^public[\\/]/, '');
        }
        if (section.image2 && section.image2 === file.originalname) {
          section.image2 = file.path.replace(/^public[\\/]/, '');
        }
      })
       
     });
   }
     
   const blogData = {
     image: payload.image,
     title: payload.title,
     details: payload.details
   }

   

    const result = await Blog.create(blogData);
    if (result) {
      const fileDeletePathimage = `${files.blogImage[0]?.path}`;
      await unlink(fileDeletePathimage);
    }

    console.log('payload.subBlogSections', payload.subBlogSections);

    const updateBlogSectionData = payload.subBlogSections.map((section: any) => {
      return {
        blogId: result._id,
        subTitle: section.title,
        subDetails: section.details,
        image1: section.image1,
        image2: section.image2,
      };
    })

    console.log('updateBlogSectionData', updateBlogSectionData);

    const subResult = await BlogSection.insertMany(updateBlogSectionData);

    if(subResult) {
      files.blogSectionImages.map((file: any) => {
        const fileDeletePath = `${file.path}`;
        unlink(fileDeletePath);
      })
    }


    return result;
  } catch (error) {
    try {
      const fileDeletePathimage = `${files.blogImage[0].path}`;
      await unlink(fileDeletePathimage);

      files.blogSectionImages.map((file: any) => {
        const fileDeletePath = `${file.path}`;
        unlink(fileDeletePath);
      })
    } catch (fsError) {
      console.error('Error accessing or deleting the image file:', fsError);
    }
    throw error;
  }
};


const getAllBlogQuery = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;

  const meta = await blogQuery.countTotal();
  return { meta, result };
};

const getSingleBlogQuery = async (id: string) => {
  const blog: any = await Blog.findById(id);
  if (!blog) {
    throw new AppError(404, 'Blog Not Found!!');
  }
  const subBlogSections = await BlogSection.find({ blogId: id });
  console.log('subBlogSections', subBlogSections);
  blog.subBlogSections = subBlogSections;
  const newResult = {...blog._doc, subBlogSections};
  return newResult;
};

const updateSingleBlogQuery = async (id: string, files: any, payload: any) => {
  try {
    console.log('id', id);
    console.log('updated payload', payload);

    if(payload.subBlogSections && payload.subBlogSections.length > 0) {
      payload.subBlogSections = JSON.parse(payload.subBlogSections as any);
    }

    // Find existing package by ID
    const blog: any = await Blog.findById(id);
    if (!blog) {
      throw new AppError(404, 'blog not found!');
    }

    const blogdata:any ={};

    if(files?.blogImage && files?.blogImage?.length > 0) {
      blogdata.image = files.blogImage[0].path.replace(/^public[\\/]/, '');
    }

    if(payload.title || payload.details){
      blogdata.title = payload.title;
      blogdata.details = payload.details;
      const result = await Blog.findByIdAndUpdate(id, blogdata, {
        new: true,
      });
      return result;
    }else if (payload.subBlogId) {
      const subBlogsData:any = {};

      console.log('files.files', files.blogSectionImages);
      console.log('payload.subBlogSections', payload.subBlogSections);

      if(files?.blogSectionImages && files?.blogSectionImages?.length > 0) {

        if(payload?.subBlogSections?.image1) {
          if(files?.blogSectionImages[0]?.originalname === payload.subBlogSections.image1) {
            subBlogsData.image1 = files.blogSectionImages[0].path.replace(/^public[\\/]/, '');
          }
        }
        
        if(payload?.subBlogSections?.image2) {
          if(files?.blogSectionImages[1]?.originalname === payload.subBlogSections.image2) {
            subBlogsData.image2 = files.blogSectionImages[0].path.replace(/^public[\\/]/, '');
          }
        }
        
        
      }
     

      if(payload.subBlogSections){
        subBlogsData.subTitle = payload.subBlogSections.subTitle;
        subBlogsData.subDetails = payload.subBlogSections.subDetails;
      }
      console.log('subBlogsData', subBlogsData);
      const result = await BlogSection.findOneAndUpdate(
        { _id: payload.subBlogId, blogId: blog._id },
        subBlogsData,
        {
          new: true,
        },
      );
      return result;
    }




  } catch (error) {
    try {
      const fileDeletePathimage = `${files.blogImage[0].path}`;
      await unlink(fileDeletePathimage);

      files.blogSectionImages.map((file: any) => {
        const fileDeletePath = `${file.path}`;
        unlink(fileDeletePath);
      });
    } catch (fsError) {
      console.error('Error accessing or deleting the image file:', fsError);
    }
    throw error;
  }
};

const deletedBlogQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new AppError(404, 'Blog Not Found!!');
  }

  console.log('blogs', blog)

  const result = await Blog.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Blog Result Not Found !');
  }
  

  const subResult = await BlogSection.deleteMany({ blogId: id });
  if (!subResult) {
    throw new AppError(404, 'Blog Section Result Not Found !');
  }

 return result;


};

export const blogService = {
  createBlog,
  getAllBlogQuery,
  getSingleBlogQuery,
  updateSingleBlogQuery,
  deletedBlogQuery,
};
