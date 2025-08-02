import Settings from "../modules/settings/settings.model";
import { User } from "../modules/user/user.models";



const superAdminData = {
  fullName: 'Admin',
  email: 'admin@gmail.com',
  password: 'admin123',
  role: 'admin',
};

const settingData = {
  privacyPolicy: '',
  aboutUs: '',
  support: '',
  termsOfService: '',
};
  


export const createSuperAdmin = async()=>{
    const existSuperAdmin = await User.findOne({ email: superAdminData.email });
    const existSettings = await Settings.findOne({});
    if (!existSuperAdmin || !existSettings) {
      const user = await User.create(superAdminData);
      const setting = await Settings.create(settingData);

      if (!user || !setting) {
        throw new Error('Super Admin creation/setting failed!');
      }
      console.log('Super Admin and settings created successfully');
    } else {
      console.log('Super Admin and settings already exists');
    }
  
}