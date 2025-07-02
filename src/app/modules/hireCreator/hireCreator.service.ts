import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { deleteFromS3, deleteManyFromS3, uploadManyToS3, uploadToS3 } from '../../utils/s3';
import { access, unlink } from 'fs/promises';
import { User } from '../user/user.models';
import HireCreator from './hireCreator.model';
import Package from '../package/package.model';
import Subscription from '../subscription/subscription.model';
import { subscriptionService } from '../subscription/subscription.service';
import { paymentService } from '../payment/payment.service';
import mongoose from 'mongoose';
import { Payment } from '../payment/payment.model';
import { notificationService } from '../notification/notification.service';

const createHireCreator = async (files: any, payload: any) => {

  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    console.log('HireCreator payload=', payload);
    // const newPayload = JSON.parse(payload);
    // console.log('HireCreator newPayload=', newPayload);
    if (typeof payload.brandInfo === 'string') {
      payload.brandInfo = JSON.parse(payload.brandInfo);
    }
    if (typeof payload.brandSocial === 'string') {
      payload.brandSocial = JSON.parse(payload.brandSocial);
    }
    if (typeof payload.contentInfo === 'string') {
      payload.contentInfo = JSON.parse(payload.contentInfo);
    }
    if (typeof payload.characteristicInfo === 'string') {
      payload.characteristicInfo = JSON.parse(payload.characteristicInfo);
    }
    if (typeof payload.doAndDonts === 'string') {
      payload.doAndDonts = JSON.parse(payload.doAndDonts);
    }
    if (typeof payload.lastContentInfo === 'string') {
      payload.lastContentInfo = JSON.parse(payload.lastContentInfo);
    }
    console.log('HireCreator parse payload =', payload);
    console.log('HireCreator files=', files);
    console.log('console-0');
    if (!files) {
      throw new AppError(403, 'At least one File is required');
    }
    if (!payload.packageId) {
      throw new AppError(403, 'Package Id is required');
    }

    const packageExist = await Package.findById(payload.packageId).session(
      session,
    );
    if (!packageExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
    }
    const user = await User.findById(payload.userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }

    if (files.ugcPhoto && files.ugcPhoto.length > 0) {
      const ugcPhoto: any = await uploadToS3({
        file: files.ugcPhoto[0],
        fileName: files.ugcPhoto[0].originalname,
        folder: 'ugcImage/',
      });
      payload.contentInfo.ugcPhoto = ugcPhoto;
    }

    if (!payload.contentInfo.ugcPhoto) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Ugc image is required');
    }
    if (packageExist.type === 'yearly' || packageExist.type === 'monthly') {
      console.log('subscription');
      if (!payload.takeVideoCount) {
        throw new AppError(403, 'Take video count required!!');
      }
      const existingSubscription = await Subscription.findOne({
        userId: payload.userId,
        type: packageExist.type,
        isDeleted: false,
      }).session(session);

      console.log('existingSubscription', existingSubscription);

      if (existingSubscription) {
        const runningubscription: any = await Subscription.findOne({
          userId: payload.userId,
          isDeleted: false,
          endDate: { $gt: new Date() },
        }).session(session);

        if (!runningubscription) {
          throw new AppError(
            403,
            'Your subscription has expired. Please renew your subscription to continue.',
          );
        }

        if (
          Number(runningubscription.takeVideoCount) +
            Number(payload.takeVideoCount) >
          Number(runningubscription.videoCount)
        ) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'You have already reached the maximum video count for this package.',
          );
        }

        if (runningubscription) {
          console.log('running');

          // if (files.ugcPhoto && files.ugcPhoto.length > 0) {
          //   const ugcPhoto: any = await uploadToS3({
          //     file: files.ugcPhoto[0],
          //     fileName: files.ugcPhoto[0].originalname,
          //     folder: 'ugcImage/',
          //   });
          //   payload.contentInfo.ugcPhoto = ugcPhoto;
          // }

          payload.subscriptionId = runningubscription._id;

          const hireCreatorData = {
            userId: payload.userId,
            subscriptionId: payload.subscriptionId,
            brandInfo: {
              name: payload.brandInfo.name,
              email: payload.brandInfo.email,
              phone: payload.brandInfo.phone,
              productName: payload.brandInfo.productName,
              productLink: payload.brandInfo.productLink,
              productType: payload.brandInfo.productType,
            },
            brandSocial: {
              tiktokHandle: payload.brandSocial.tiktokHandle,
              tiktokLink: payload.brandSocial.tiktokLink,
              instragramHandle: payload.brandSocial.instragramHandle,
              instragramLink: payload.brandSocial.instragramLink,
              websiteLink: payload.brandSocial.websiteLink,
            },
            contentInfo: {
              additionalFormate: payload.contentInfo.additionalFormate,
              videoDuration: payload.contentInfo.videoDuration,
              platForm: payload.contentInfo.platForm,
              usageType: payload.contentInfo.usageType,
              adHookOrCtaRequest: payload.contentInfo.adHookOrCtaRequest,
              exampleVideoLink: payload.contentInfo.exampleVideoLink,
              ugcPhoto: payload.contentInfo.ugcPhoto,
            },
            characteristicInfo: {
              ageRange: payload.characteristicInfo.ageRange,
              gender: payload.characteristicInfo.gender,
              location: payload.characteristicInfo.location,
              language: payload.characteristicInfo.language,
              script: payload.characteristicInfo.script,
            },
            doAndDonts: {
              anyWordsNotToUse: payload.doAndDonts.anyWordsNotToUse,
              anySpecificWordsUse: payload.doAndDonts.anySpecificWordsUse,
              howToPronouncebrandName:
                payload.doAndDonts.howToPronouncebrandName,
              anySpecialRequest: payload.doAndDonts.anySpecialRequest,
              expressDelivery: payload.doAndDonts.expressDelivery,
            },
            lastContentInfo: {
              textOverlay: payload.lastContentInfo.textOverlay,
              captions: payload.lastContentInfo.captions,
              music: payload.lastContentInfo.music,
              extraHook: payload.lastContentInfo.extraHook,
              extraCta: payload.lastContentInfo.extraCta,
              videoType: payload.lastContentInfo.videoType,
              additionalPerson: payload.lastContentInfo.additionalPerson,
              offSiteAttraction: payload.lastContentInfo.offSiteAttraction,
              goalOfProject: payload.lastContentInfo.goalOfProject,
              tergetAudience: payload.lastContentInfo.tergetAudience,
            },
            takeVideoCount: payload.takeVideoCount,
          };

          const result = await HireCreator.create([hireCreatorData], {
            session,
          });
          if (!result) {
            throw new AppError(403, 'HireCreator created faild!!');
          }

          if (files?.ugcPhoto?.[0]?.path) {
            const fileDeletePath = `${files.ugcPhoto[0].path}`;
            await unlink(fileDeletePath);
            console.log('File deleted successfully');
          }
          await session.commitTransaction();
          session.endSession();

          return result;
        }
      } else {
        console.log('create subscriptioin');

        // if (files.ugcPhoto && files.ugcPhoto.length > 0) {
        //   const ugcPhoto: any = await uploadToS3({
        //     file: files.ugcPhoto[0],
        //     fileName: files.ugcPhoto[0].originalname,
        //     folder: 'ugcImage/',
        //   });
        //   payload.contentInfo.ugcPhoto = ugcPhoto;
        // }

        const subscriptionData = {
          packageId: packageExist._id,
          userId: payload.userId,
        };

        const subcriptionResult: any =
          await subscriptionService.createSubscription(
            subscriptionData,
            session,
          );

        if (!subcriptionResult) {
          throw new AppError(403, 'Subscription created faild!!');
        }
        console.log('subcriptionResult==', subcriptionResult);
        if (
          Number(subcriptionResult.takeVideoCount) +
            Number(payload.takeVideoCount) >
          Number(subcriptionResult.videoCount)
        ) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'You have already reached the maximum video count for this package.',
          );
        }

        payload.subscriptionId = subcriptionResult._id;

        const hireCreatorData = {
          userId: payload.userId,
          subscriptionId: payload.subscriptionId,
          brandInfo: {
            name: payload.brandInfo.name,
            email: payload.brandInfo.email,
            phone: payload.brandInfo.phone,
            productName: payload.brandInfo.productName,
            productLink: payload.brandInfo.productLink,
            productType: payload.brandInfo.productType,
          },
          brandSocial: {
            tiktokHandle: payload.brandSocial.tiktokHandle,
            tiktokLink: payload.brandSocial.tiktokLink,
            instragramHandle: payload.brandSocial.instragramHandle,
            instragramLink: payload.brandSocial.instragramLink,
            websiteLink: payload.brandSocial.websiteLink,
          },
          contentInfo: {
            additionalFormate: payload.contentInfo.additionalFormate,
            videoDuration: payload.contentInfo.videoDuration,
            platForm: payload.contentInfo.platForm,
            usageType: payload.contentInfo.usageType,
            adHookOrCtaRequest: payload.contentInfo.adHookOrCtaRequest,
            exampleVideoLink: payload.contentInfo.exampleVideoLink,
            ugcPhoto: payload.contentInfo.ugcPhoto,
          },
          characteristicInfo: {
            ageRange: payload.characteristicInfo.ageRange,
            gender: payload.characteristicInfo.gender,
            location: payload.characteristicInfo.location,
            language: payload.characteristicInfo.language,
            script: payload.characteristicInfo.script,
          },
          doAndDonts: {
            anyWordsNotToUse: payload.doAndDonts.anyWordsNotToUse,
            anySpecificWordsUse: payload.doAndDonts.anySpecificWordsUse,
            howToPronouncebrandName: payload.doAndDonts.howToPronouncebrandName,
            anySpecialRequest: payload.doAndDonts.anySpecialRequest,
            expressDelivery: payload.doAndDonts.expressDelivery,
          },
          lastContentInfo: {
            textOverlay: payload.lastContentInfo.textOverlay,
            captions: payload.lastContentInfo.captions,
            music: payload.lastContentInfo.music,
            extraHook: payload.lastContentInfo.extraHook,
            extraCta: payload.lastContentInfo.extraCta,
            videoType: payload.lastContentInfo.videoType,
            additionalPerson: payload.lastContentInfo.additionalPerson,
            offSiteAttraction: payload.lastContentInfo.offSiteAttraction,
            goalOfProject: payload.lastContentInfo.goalOfProject,
            tergetAudience: payload.lastContentInfo.tergetAudience,
          },
          takeVideoCount: payload.takeVideoCount,
        };

        const result = await HireCreator.create([hireCreatorData], { session });
        if (!result) {
          throw new AppError(403, 'HireCreator created faild!!');
        }

        if (files?.ugcPhoto?.[0]?.path) {
          const fileDeletePath = `${files.ugcPhoto[0].path}`;
          await unlink(fileDeletePath);
          console.log('File deleted successfully');
        }

        if (result.length > 0) {
          const paymentData = {
            userId: payload.userId,
            amount: subcriptionResult.price,
            orderId: result[0]._id,
          };

          const paymentUrl =
            paymentService.createPaypalPaymentService(paymentData);

          await session.commitTransaction();
          session.endSession();

          return paymentUrl;
        }
      }
    } else {
      console.log('package ');
      const runningubscription = await Subscription.findOne({
        userId: payload.userId,
        isDeleted: false,
        endDate: { $gt: new Date() },
      }).session(session);

      if (runningubscription) {
        throw new AppError(400, 'Your Subscription is already running!');
      }

      const subscriptionData = {
        packageId: packageExist._id,
        userId: payload.userId,
      };

      const subcriptionResult: any =
        await subscriptionService.createSubscription(subscriptionData);

        console.log('subcriptionResult==', subcriptionResult);
      if (!subcriptionResult) {
        throw new AppError(403, 'Subscription created faild!!');
      }

      payload.subscriptionId = subcriptionResult._id;

      const hireCreatorData = {
        userId: payload.userId,
        subscriptionId: payload.subscriptionId,
        brandInfo: {
          name: payload.brandInfo.name,
          email: payload.brandInfo.email,
          phone: payload.brandInfo.phone,
          productName: payload.brandInfo.productName,
          productLink: payload.brandInfo.productLink,
          productType: payload.brandInfo.productType,
        },
        brandSocial: {
          tiktokHandle: payload.brandSocial.tiktokHandle,
          tiktokLink: payload.brandSocial.tiktokLink,
          instragramHandle: payload.brandSocial.instragramHandle,
          instragramLink: payload.brandSocial.instragramLink,
          websiteLink: payload.brandSocial.websiteLink,
        },
        contentInfo: {
          additionalFormate: payload.contentInfo.additionalFormate,
          videoDuration: payload.contentInfo.videoDuration,
          platForm: payload.contentInfo.platForm,
          usageType: payload.contentInfo.usageType,
          adHookOrCtaRequest: payload.contentInfo.adHookOrCtaRequest,
          exampleVideoLink: payload.contentInfo.exampleVideoLink,
          ugcPhoto: payload.contentInfo.ugcPhoto,
        },
        characteristicInfo: {
          ageRange: payload.characteristicInfo.ageRange,
          gender: payload.characteristicInfo.gender,
          location: payload.characteristicInfo.location,
          language: payload.characteristicInfo.language,
          script: payload.characteristicInfo.script,
        },
        doAndDonts: {
          anyWordsNotToUse: payload.doAndDonts.anyWordsNotToUse,
          anySpecificWordsUse: payload.doAndDonts.anySpecificWordsUse,
          howToPronouncebrandName: payload.doAndDonts.howToPronouncebrandName,
          anySpecialRequest: payload.doAndDonts.anySpecialRequest,
          expressDelivery: payload.doAndDonts.expressDelivery,
        },
        lastContentInfo: {
          textOverlay: payload.lastContentInfo.textOverlay,
          captions: payload.lastContentInfo.captions,
          music: payload.lastContentInfo.music,
          extraHook: payload.lastContentInfo.extraHook,
          extraCta: payload.lastContentInfo.extraCta,
          videoType: payload.lastContentInfo.videoType,
          additionalPerson: payload.lastContentInfo.additionalPerson,
          offSiteAttraction: payload.lastContentInfo.offSiteAttraction,
          goalOfProject: payload.lastContentInfo.goalOfProject,
          tergetAudience: payload.lastContentInfo.tergetAudience,
        },
        takeVideoCount: payload.takeVideoCount,
      };

      console.log('hireCreatorData package data', hireCreatorData);

      console.log('dsafafaafasfasfasfa')
      console.log('dsafafaafasfasfasfa=====', hireCreatorData.subscriptionId);
      const subscriptionId = new mongoose.Types.ObjectId(
        hireCreatorData.subscriptionId,
      );

      const subscriptioinCompleted = await Subscription.findOne({
        _id: subscriptionId,
        status: 'completed',
      }).session(session);

      console.log('subscriptioinCompleted', subscriptioinCompleted);
      if (subscriptioinCompleted) {
        throw new AppError(403, 'Subscription already completed!!');
      }
      console.log('ddssasfaf')

      const result = await HireCreator.create([hireCreatorData], { session });
      console.log('result', result);
      if (!result) {
        throw new AppError(403, 'HireCreator created faild!!');
      }

      if (files?.ugcPhoto?.[0]?.path) {
        const fileDeletePath = `${files.ugcPhoto[0].path}`;
        await unlink(fileDeletePath);
        console.log('File deleted successfully');
      }

      
        const paymentData = {
          userId: payload.userId,
          amount: subcriptionResult.price,
          orderId: result[0]._id,
        };
        console.log('paymentData', paymentData);

        const paymentUrl = await 
          paymentService.createPaypalPaymentService(paymentData);
        console.log('paymentUrl', paymentUrl);

        await session.commitTransaction();
        session.endSession();
       

        return paymentUrl;
    }
  } catch (error: any) {
    await session.abortTransaction();
    if (session.inTransaction()) {
      // Using inTransaction() method to check if the session is in a transaction
      await session.abortTransaction();
    }
    console.log('error', error);
    const key = `ugcImage/${files?.ugcPhoto?.[0]?.originalname}`;

    const deleteImage = await deleteFromS3(key);
    if (deleteImage) {
      console.log('Image deleted successfully');
    }
    try {
      if (files?.ugcPhoto?.[0]?.path) {
        const fileDeletePath = `${files.ugcPhoto[0].path}`;
        await unlink(fileDeletePath);
        console.log('File deleted successfully');
      }

      if (error.statusCode && error.message) {
        throw new AppError(error.statusCode, error.message);
      }
    } catch (fsError: any) {
      console.error('Error accessing or deleting the image file:', fsError);
      throw new AppError(fsError.statusCode, fsError.message);
    }
  } 
  // finally {
  //   session.endSession();
  // }
};


// const createHireCreator = async (files: any, payload: any) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     console.log('HireCreator payload=', payload);

//     if (typeof payload.brandInfo === 'string') {
//       payload.brandInfo = JSON.parse(payload.brandInfo);
//     }
//     if (typeof payload.brandSocial === 'string') {
//       payload.brandSocial = JSON.parse(payload.brandSocial);
//     }
//     if (typeof payload.contentInfo === 'string') {
//       payload.contentInfo = JSON.parse(payload.contentInfo);
//     }
//     if (typeof payload.characteristicInfo === 'string') {
//       payload.characteristicInfo = JSON.parse(payload.characteristicInfo);
//     }
//     if (typeof payload.doAndDonts === 'string') {
//       payload.doAndDonts = JSON.parse(payload.doAndDonts);
//     }
//     if (typeof payload.lastContentInfo === 'string') {
//       payload.lastContentInfo = JSON.parse(payload.lastContentInfo);
//     }
//     console.log('HireCreator parse payload =', payload);
//     console.log('HireCreator files=', files);
//     console.log('console-0');
//     if (!files) {
//       throw new AppError(403, 'At least one File is required');
//     }
//     if (!payload.packageId) {
//       throw new AppError(403, 'Package Id is required');
//     }

//     const packageExist = await Package.findById(payload.packageId).session(
//       session,
//     );
//     if (!packageExist) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
//     }
//     const user = await User.findById(payload.userId).session(session);
//     if (!user) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
//     }

//     if (files.ugcPhoto && files.ugcPhoto.length > 0) {
//       const ugcPhoto: any = await uploadToS3({
//         file: files.ugcPhoto[0],
//         fileName: files.ugcPhoto[0].originalname,
//         folder: 'ugcImage/',
//       });
//       payload.contentInfo.ugcPhoto = ugcPhoto;
//     }

//     if (!payload.contentInfo.ugcPhoto) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Ugc image is required');
//     }

//     if (packageExist.type === 'yearly' || packageExist.type === 'monthly') {
//       console.log('subscription');
//       if (!payload.takeVideoCount) {
//         throw new AppError(403, 'Take video count required!!');
//       }
//       const existingSubscription = await Subscription.findOne({
//         userId: payload.userId,
//         type: packageExist.type,
//         isDeleted: false,
//       }).session(session);

//       console.log('existingSubscription', existingSubscription);

//       if (existingSubscription) {
//         const runningubscription = await Subscription.findOne({
//           userId: payload.userId,
//           isDeleted: false,
//           endDate: { $gt: new Date() },
//         }).session(session);

//         if (!runningubscription) {
//           throw new AppError(
//             403,
//             'Your subscription has expired. Please renew your subscription to continue.',
//           );
//         }

//         if (
//           Number(runningubscription.takeVideoCount) +
//             Number(payload.takeVideoCount) >
//           Number(runningubscription.videoCount)
//         ) {
//           throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'You have already reached the maximum video count for this package.',
//           );
//         }

//         payload.subscriptionId = runningubscription._id;
//         const hireCreatorData = {
//           userId: payload.userId,
//           subscriptionId: payload.subscriptionId,
//           brandInfo: {
//             name: payload.brandInfo.name,
//             email: payload.brandInfo.email,
//             phone: payload.brandInfo.phone,
//             productName: payload.brandInfo.productName,
//             productLink: payload.brandInfo.productLink,
//             productType: payload.brandInfo.productType,
//           },
//           brandSocial: {
//             tiktokHandle: payload.brandSocial.tiktokHandle,
//             tiktokLink: payload.brandSocial.tiktokLink,
//             instragramHandle: payload.brandSocial.instragramHandle,
//             instragramLink: payload.brandSocial.instragramLink,
//             websiteLink: payload.brandSocial.websiteLink,
//           },
//           contentInfo: {
//             additionalFormate: payload.contentInfo.additionalFormate,
//             videoDuration: payload.contentInfo.videoDuration,
//             platForm: payload.contentInfo.platForm,
//             usageType: payload.contentInfo.usageType,
//             adHookOrCtaRequest: payload.contentInfo.adHookOrCtaRequest,
//             exampleVideoLink: payload.contentInfo.exampleVideoLink,
//             ugcPhoto: payload.contentInfo.ugcPhoto,
//           },
//           characteristicInfo: {
//             ageRange: payload.characteristicInfo.ageRange,
//             gender: payload.characteristicInfo.gender,
//             location: payload.characteristicInfo.location,
//             language: payload.characteristicInfo.language,
//             script: payload.characteristicInfo.script,
//           },
//           doAndDonts: {
//             anyWordsNotToUse: payload.doAndDonts.anyWordsNotToUse,
//             anySpecificWordsUse: payload.doAndDonts.anySpecificWordsUse,
//             howToPronouncebrandName: payload.doAndDonts.howToPronouncebrandName,
//             anySpecialRequest: payload.doAndDonts.anySpecialRequest,
//             expressDelivery: payload.doAndDonts.expressDelivery,
//           },
//           lastContentInfo: {
//             textOverlay: payload.lastContentInfo.textOverlay,
//             captions: payload.lastContentInfo.captions,
//             music: payload.lastContentInfo.music,
//             extraHook: payload.lastContentInfo.extraHook,
//             extraCta: payload.lastContentInfo.extraCta,
//             videoType: payload.lastContentInfo.videoType,
//             additionalPerson: payload.lastContentInfo.additionalPerson,
//             offSiteAttraction: payload.lastContentInfo.offSiteAttraction,
//             goalOfProject: payload.lastContentInfo.goalOfProject,
//             tergetAudience: payload.lastContentInfo.tergetAudience,
//           },
//           takeVideoCount: payload.takeVideoCount,
//         };

//         const result =
//           await HireCreator.create([hireCreatorData], { session });
//         if (!result) {
//           throw new AppError(403, 'HireCreator creation failed');
//         }

//         if (files?.ugcPhoto?.[0]?.path) {
//           const fileDeletePath = `${files.ugcPhoto[0].path}`;
//           await unlink(fileDeletePath);
//           console.log('File deleted successfully');
//         }
//         await session.commitTransaction();
//         return result;
//       }else{

//       }
//     }

//     console.log('create subscription');
//     const subscriptionData = {
//       packageId: packageExist._id,
//       userId: payload.userId,
//     };

//     const subscriptionResult = await subscriptionService.createSubscription(
//       subscriptionData,
//       session,
//     );

//     if (!subscriptionResult) {
//       throw new AppError(403, 'Subscription creation failed');
//     }

//     payload.subscriptionId = subscriptionResult._id;

//     const hireCreatorData = {
//       userId: payload.userId,
//       subscriptionId: payload.subscriptionId,
//       brandInfo: {
//         name: payload.brandInfo.name,
//         email: payload.brandInfo.email,
//         phone: payload.brandInfo.phone,
//         productName: payload.brandInfo.productName,
//         productLink: payload.brandInfo.productLink,
//         productType: payload.brandInfo.productType,
//       },
//       brandSocial: {
//         tiktokHandle: payload.brandSocial.tiktokHandle,
//         tiktokLink: payload.brandSocial.tiktokLink,
//         instragramHandle: payload.brandSocial.instragramHandle,
//         instragramLink: payload.brandSocial.instragramLink,
//         websiteLink: payload.brandSocial.websiteLink,
//       },
//       contentInfo: {
//         additionalFormate: payload.contentInfo.additionalFormate,
//         videoDuration: payload.contentInfo.videoDuration,
//         platForm: payload.contentInfo.platForm,
//         usageType: payload.contentInfo.usageType,
//         adHookOrCtaRequest: payload.contentInfo.adHookOrCtaRequest,
//         exampleVideoLink: payload.contentInfo.exampleVideoLink,
//         ugcPhoto: payload.contentInfo.ugcPhoto,
//       },
//       characteristicInfo: {
//         ageRange: payload.characteristicInfo.ageRange,
//         gender: payload.characteristicInfo.gender,
//         location: payload.characteristicInfo.location,
//         language: payload.characteristicInfo.language,
//         script: payload.characteristicInfo.script,
//       },
//       doAndDonts: {
//         anyWordsNotToUse: payload.doAndDonts.anyWordsNotToUse,
//         anySpecificWordsUse: payload.doAndDonts.anySpecificWordsUse,
//         howToPronouncebrandName: payload.doAndDonts.howToPronouncebrandName,
//         anySpecialRequest: payload.doAndDonts.anySpecialRequest,
//         expressDelivery: payload.doAndDonts.expressDelivery,
//       },
//       lastContentInfo: {
//         textOverlay: payload.lastContentInfo.textOverlay,
//         captions: payload.lastContentInfo.captions,
//         music: payload.lastContentInfo.music,
//         extraHook: payload.lastContentInfo.extraHook,
//         extraCta: payload.lastContentInfo.extraCta,
//         videoType: payload.lastContentInfo.videoType,
//         additionalPerson: payload.lastContentInfo.additionalPerson,
//         offSiteAttraction: payload.lastContentInfo.offSiteAttraction,
//         goalOfProject: payload.lastContentInfo.goalOfProject,
//         tergetAudience: payload.lastContentInfo.tergetAudience,
//       },
//       takeVideoCount: payload.takeVideoCount,
//     };

//     const result = await HireCreator.create(hireCreatorData).session(session);
//     if (!result) {
//       throw new AppError(403, 'HireCreator creation failed');
//     }

//     await session.commitTransaction();
//     return result;
//   } catch (error) {
//     await session.abortTransaction();
//     console.log('Error in transaction:', error);

//     throw error;
//   } finally {
//     session.endSession();
//   }
// };


const getAllHireCreatorQuery = async (query: Record<string, unknown>) => {
  const HireCreatorQuery = new QueryBuilder(
    HireCreator.find({})
      .populate({ path: 'userId', select: 'fullName' })
      .populate({ path: 'subscriptionId', select: 'price' })
      .populate('creatorId')
      .populate('creatorUserId')
      .select(
        'brandInfo.name brandInfo.email brandInfo.phone brandInfo.productName status paymentStatus',
      ),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await HireCreatorQuery.modelQuery;

  const meta = await HireCreatorQuery.countTotal();
  return { meta, result };
};


const getAllHireCreatorByUserQuery = async (
  query: Record<string, unknown>,
  userId: String,
) => {
  const HireCreatorQuery = new QueryBuilder(
    HireCreator.find({ userId }).populate('userId').populate('subscriptionId'),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await HireCreatorQuery.modelQuery;

  const meta = await HireCreatorQuery.countTotal();
  return { meta, result };
};

const getSingleHireCreatorQuery = async (id: string) => {
  const hireCreator: any = await HireCreator.findById(id)
    .populate('userId')
    .populate('subscriptionId');
  if (!hireCreator) {
    throw new AppError(404, 'HireCreator Not Found!!');
  }
  return hireCreator;
};

const updateSingleHireCreatorQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const HireCreatorProduct: any = await HireCreator.findById(id);
  if (!HireCreatorProduct) {
    throw new AppError(404, 'HireCreator is not found!');
  }

  const result = await HireCreator.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(403, 'HireCreator updated faild!!');
  }

  return result;
};


const approvedSingleHireCreator = async (id: String) => {
  console.log('id', id);

  const session = await mongoose.startSession();
  session.startTransaction();

  // id check mongoose id
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new AppError(400, 'Invalid HireCreator ID');
  }
  

  try {
    const hireCreator: any =
      await HireCreator.findById(id).session(session);
    if (!hireCreator) {
      throw new AppError(404, 'HireCreator is not found!');
    }

    if (hireCreator.status === 'approved') {
      throw new AppError(400, 'HireCreator is already approved!');
    }
    if (hireCreator.status === 'cancel') {
      throw new AppError(400, 'HireCreator is already canceled!');
    }

    const subscriptioinExist = await Subscription.findById(
      hireCreator.subscriptionId,
    ).session(session);
    if (!subscriptioinExist) {
      throw new AppError(404, 'Subscription not found!!');
    }

    if (
      subscriptioinExist.type === 'yearly' ||
      subscriptioinExist.type === 'monthly'
    ) {
      const updateTakeVideoCount =
        Number(subscriptioinExist.takeVideoCount) +
        Number(hireCreator.takeVideoCount);
      await Subscription.findByIdAndUpdate(
        hireCreator.subscriptionId,
        { takeVideoCount: updateTakeVideoCount },
        { new: true, session },
      );
    } else {
      await Subscription.findByIdAndUpdate(
        hireCreator.subscriptionId,
        { takeVideoCount: subscriptioinExist.videoCount },
        { new: true, session },
      );
    }
    // 684f974057f251d44a8bc8b4
    const result = await HireCreator.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true, session },
    );

    if (!result) {
      throw new AppError(403, 'HireCreator update failed!');
    }

    const notificationData = {
      userId: hireCreator.userId,
      message: `HireCreator approved by admin!`,
      type:"success"
    }

    await notificationService.createNotification(notificationData)

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    console.log('errror', error);
    await session.abortTransaction();
    session.endSession();

    throw new AppError(error.statusCode, error.message);
  }
};


const cancelSingleHireCreator = async (id: String) => {
  console.log('id', id);

  const session = await mongoose.startSession();
  session.startTransaction();

  // id check mongoose id
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new AppError(400, 'Invalid HireCreator ID');
  }

  try {
    const hireCreator: any = await HireCreator.findById(id).session(session);
    if (!hireCreator) {
      throw new AppError(404, 'HireCreator is not found!');
    }

    if (hireCreator.status === 'approved') {
      throw new AppError(400, 'HireCreator is already approved!');
    }

    if (hireCreator.status === 'cancel') {
      throw new AppError(400, 'HireCreator is already canceled!');
    }
    

    const subscriptioinExist = await Subscription.findById(
      hireCreator.subscriptionId,
    ).session(session);
    if (!subscriptioinExist) {
      throw new AppError(404, 'Subscription not found!!');
    }

    const paymentExist = await Payment.findOne({
      userId: hireCreator.userId,
      subscriptionId: hireCreator.subscriptionId
    }).session(session);

    if (!paymentExist) {
      throw new AppError(404, 'Payment not found!!');
    }

    const refundAmount:any = await paymentService.refundPaypalPaymentService(
      paymentExist.transactionId,
      Number(paymentExist.amount),
    );

    console.log('refundAmount', refundAmount);

    if (refundAmount === 'Refund successful.') {
      const result = await HireCreator.findByIdAndUpdate(
        id,
        { status: 'cancel' },
        { new: true, session },
      );
      const paymentDataUpdate = await Payment.findOneAndUpdate(
        {
          userId: hireCreator.userId,
          subscriptionId: hireCreator.subscriptionId,
        },
        { isRefund: true },
        { new: true, session },
      );

      if (!paymentDataUpdate) {
        throw new AppError(403, 'Payment update failed!');
      }
      if (!result) {
        throw new AppError(403, 'HireCreator update failed!');
      }

      const notificationData = {
        userId: hireCreator.userId,
        message: `HireCreator canceled by admin!`,
        type: 'success',
      };
      const notificationData1 = {
        userId: hireCreator.userId,
        message: `Payment refund successful!`,
        type: 'success',
      };

      await notificationService.createNotification(notificationData, session);
      await notificationService.createNotification(notificationData1, session);
      await session.commitTransaction();
      session.endSession();

      return result;
    } else {
      await session.commitTransaction();
      session.endSession();

      throw new AppError(403, 'HireCreator cancel failed!');
    }
      

    
  } catch (error: any) {
    console.log('errror', error);
    await session.abortTransaction();
    session.endSession();

    throw new AppError(error.statusCode, error.message);
  }
};


const assignTaskCreatorUploadVideosByCreator = async (
  id: string,
  userId: string,
  files: any,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!id || !userId) {
      throw new AppError(400, 'Invalid input parameters');
    }

    const hireCreator: any =
      await HireCreator.findById(id).session(session);
    if (!hireCreator) {
      throw new AppError(404, 'Hire Creator is not found!!');
    }

    const subscriptioin = await Subscription.findById(
      hireCreator.subscriptionId,
    ).session(session);
    if (!subscriptioin) {
      throw new AppError(404, 'Subscription not found!!');
    }

    if (
      hireCreator.status !== 'ongoing'  ||
        hireCreator.creatorUserId.toString() !== userId.toString()
    ) {
      throw new AppError(
        404,
        'HireCreator is not ongoing, you are not the creator!',
      );
    }

    if (!files || files.uploadVideos.length === 0) {
      throw new AppError(400, 'No video files uploaded');
    }



    if (files.uploadVideos.length > subscriptioin.takeVideoCount) {
      throw new AppError(
        400,
        `You can only upload ${subscriptioin.takeVideoCount} videos`,
      );
    }

    if (files.uploadVideos && files.uploadVideos.length > 0) {
      const videos: any = await uploadManyToS3(
        files.uploadVideos,
        'uploadVideos/',
      );

      if (!videos || videos.length === 0) {
        throw new AppError(400, 'Video upload failed');
      }

      const updateHireCreator = await HireCreator.findByIdAndUpdate(
        id,
        { uploadedFiles: videos, status: 'completed' },
        { new: true, session },
      );

      if ( !updateHireCreator) {
        throw new AppError(
          403,
          'Failed to update HireCreator',
        );
      }

      const allVideoPaths = files.uploadVideos.map(
        (video: any) => `${video.path}`,
      );
      await Promise.all(allVideoPaths.map((path: any) => unlink(path)));

      await session.commitTransaction();
      session.endSession();

      return updateHireCreator;
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    try {
      const allVideoPaths = files?.uploadVideos?.map(
        (video: any) => `${video.path}`,
      );
      if (allVideoPaths) {
        await Promise.all(allVideoPaths.map((path: any) => unlink(path)));
      }
    } catch (fsError) {
      console.error('Error accessing or deleting the video files:', fsError);
    }

    throw new AppError(
      error.statusCode || 500,
      error.message || 'An error occurred',
    );
  }
};

const assignTaskRevisionByUser = async (
  id: string,
  userId: string,
  payload: any,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!payload.revisionText && !payload.status) {
      throw new AppError(
        400,
        'Invalid input parameters: revisionText or status is required',
      );
    }

    if (!id || !userId) {
      throw new AppError(400, 'Invalid input parameters');
    }

    if (payload.revisionText) {
      const hireCreator: any = await HireCreator.findById(id).session(session);
      if (!hireCreator) {
        throw new AppError(404, 'Hire Creator is not found!!');
      }
      if (hireCreator.status === 'delivered') {
        throw new AppError(404, 'AssignTaskCreator is already delivered!!');
      }

      if (
        hireCreator.status !== 'completed' ||
        hireCreator.userId.toString() !== userId.toString()
      ) {
        throw new AppError(
          404,
          'HireCreator is not completed, you are not the brand creator!!',
        );
      }
     

      const updateHireCreator = await HireCreator.findByIdAndUpdate(
        id,
        { status: 'revision', isScript: payload.revisionText },
        { new: true, session },
      );

      if (!updateHireCreator) {
        throw new AppError(403, 'HireCreator update failed!!');
      }
      await session.commitTransaction();
      session.endSession();

      return updateHireCreator;
    } else if (payload.status && payload.status === 'delivered') {
      const hireCreator: any = await HireCreator.findById(id).session(session);
      if (!hireCreator) {
        throw new AppError(404, 'Hire Creator is not found!!');
      }
      if (hireCreator.status === 'delivered') {
        throw new AppError(404, 'AssignTaskCreator is already delivered!!');
      }

      if (
        hireCreator.status !== 'completed' ||
        hireCreator.userId.toString() !== userId.toString()
      ) {
        throw new AppError(
          404,
          'HireCreator is not completed, you are not the brand creator!!',
        );
      }
    
      const updateHireCreator: any = await HireCreator.findByIdAndUpdate(
        id,
        { status: 'delivered' },
        { new: true, session },
      );

      const subscriptioinUpdate = await Subscription.findOneAndUpdate(
        { _id: updateHireCreator.subscriptionId },
        { status: 'completed' },
        { new: true, session },
      );

      if (!updateHireCreator) {
        throw new AppError(403, 'Hire Creator update failed!!');
      }
      await session.commitTransaction();
      session.endSession();

      return updateHireCreator;
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      error.statusCode || 500,
      error.message || 'Something went wrong!',
    );
  }
};

const assignTaskCreatorReSubmitUploadVideosByCreator = async (
  id: string,
  userId: string,
  files: any,
) => {
  if (!id || !userId) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const hireCreator: any = await HireCreator.findById(id);
  if (!hireCreator) {
    throw new AppError(404, 'Hire Creator is not found!!');
  }

  try {
    if (
      hireCreator.status !== 'revision' ||
      hireCreator.creatorUserId.toString() !== userId.toString()
    ) {
      throw new AppError(
        404,
        'AssignTaskCreator is not approved, you are not the creator!',
      );
    }

    const subscriptioin = await Subscription.findById(
      hireCreator.subscriptionId,
    );
    if (!subscriptioin) {
      throw new AppError(404, 'Subscription not found!!');
    }

    if (!files || files.uploadVideos.length === 0) {
      throw new AppError(400, 'No video files uploaded');
    }

    if (files.uploadVideos.length > subscriptioin.takeVideoCount) {
      throw new AppError(
        400,
        `You can only upload ${subscriptioin.takeVideoCount} videos`,
      );
    }

    console.log(
      'assignTaskCreatorProduct.uploadedFiles',
      hireCreator.uploadedFiles,
    );

    const keys = hireCreator.uploadedFiles.map(
      (key: any) => key.url.split('amazonaws.com/')[1],
    );
    console.log('keys', keys);

    const deleteImage: any = await deleteManyFromS3(keys);
    console.log('deleteImage', deleteImage);

    if (deleteImage && files.uploadVideos && files.uploadVideos.length > 0) {
      const videos: any = await uploadManyToS3(
        files.uploadVideos,
        'uploadVideos/',
      );

      if (!videos || videos.length === 0) {
        throw new AppError(400, 'Video upload failed');
      }

      const updateHireCreator = await HireCreator.findByIdAndUpdate(
        id,
        { uploadedFiles: videos, status: 'completed' },
        { new: true },
      );

      if (!updateHireCreator) {
        throw new AppError(403, 'Failed to update HireCreator');
      }
      if (updateHireCreator) {
        const allVideo = files.uploadVideos.map(
          (video: any) => `${video.path}`,
        );
        await Promise.all(allVideo.map((path: any) => unlink(path)));
      }

      return updateHireCreator;
    }
  } catch (error: any) {
    try {
      const allVideo = files?.uploadVideos?.map(
        (video: any) => `${video.path}`,
      );
      await Promise.all(allVideo?.map((path: any) => unlink(path)));
    } catch (fsError) {
      console.error('Error accessing or deleting the image file:', fsError);
      throw new AppError(
        error.statusCode || 500,
        error.message || 'An error occurred while processing the request',
      );
    }
    throw error;
  }
};



const deletedHireCreatorQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const hireCreator = await HireCreator.findById(id);
  if (!hireCreator) {
    throw new AppError(404, 'HireCreator Not Found!!');
  }

  const result = await HireCreator.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'HireCreator Result Not Found !');
  }

  return result;
};

export const hireCreatorService = {
  createHireCreator,
  getAllHireCreatorQuery,
  getAllHireCreatorByUserQuery,
  getSingleHireCreatorQuery,
  updateSingleHireCreatorQuery,
  approvedSingleHireCreator,
  cancelSingleHireCreator,
  assignTaskCreatorUploadVideosByCreator,
  assignTaskRevisionByUser,
  assignTaskCreatorReSubmitUploadVideosByCreator,
  deletedHireCreatorQuery,
};
