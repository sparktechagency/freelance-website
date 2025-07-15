import { User } from "../modules/user/user.models";



const superAdminData = {
  fullName: 'Admin',
  email: 'admin@gmail.com',
  password: 'admin123',
  role: 'admin',
};



export const createSuperAdmin = async()=>{

    const existSuperAdmin = await User.findOne({ email: superAdminData.email });
    if (!existSuperAdmin) {
      const user = await User.create(superAdminData);

      if (!user) {
        throw new Error('Super Admin creation failed!');
      }
      console.log('Super Admin created successfully');
    } else {
      console.log('Super Admin already exists');
    }

}