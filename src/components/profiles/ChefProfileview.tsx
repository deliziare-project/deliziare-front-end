'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchChefProfileById } from '@/features/profileSlice';

type Props = {
  chefId: string;
};

const ChefProfileview = ({ chefId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chefProfile, loading, error } = useSelector((state: RootState) => state.profile);
  // console.log('chf data',chefProfile)

  useEffect(() => {
    if (chefId) dispatch(fetchChefProfileById(chefId));
  }, [chefId, dispatch]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!chefProfile) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={chefProfile.user?.profileImage || '/default-chef.jpg'}
          alt="Chef Profile"
          className="w-36 h-36 rounded-full object-cover border-2 border-gray-300"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold">{chefProfile.user?.name || 'Chef Name'}</h2>
          <p className="mt-2 text-gray-700">{chefProfile.chef?.bio || 'No bio available'}</p>
          <p className="mt-1 text-sm text-gray-500">Experience: {chefProfile.chef?.experience || 'N/A'} years</p>

          {chefProfile.chef?.specialize?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
              {chefProfile.chef.specialize.map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800 border"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="mt-8 border-gray-300" />
      <h3 className="text-center text-sm text-gray-500 font-semibold mt-6 tracking-widest">POSTS</h3>
    </div>
  );
};

export default ChefProfileview;
