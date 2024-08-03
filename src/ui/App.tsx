import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { MdAdd, MdOutlineClose } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import { type SettingsSchema, settingsSchema } from '../common/settings';
import { Toggle } from './components/Toggle';

export const App: React.FC = () => {
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'branches',
  });

  const onSubmit = (data: SettingsSchema) => {
    chrome.storage.local.set({ mySetting: data });
    toast.success('Saved');
  };

  useEffect(() => {
    chrome.storage.local.get(['mySetting'], (result) => {
      if (result.mySetting) {
        reset(result.mySetting);
      }
      reset({
        branches: [
          {
            name: 'main',
            enable: true,
          },
        ],
      });
    });
  }, [reset]);

  return (
    <div>
      <ToastContainer autoClose={1000} />
      <div className="w-screen p-2">
        <h1 className="text-lg">Settings</h1>
        <hr className="bg-transparent border-b border-gray-300 my-2" />
        <form
          className="flex flex-col space-y-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <div className="flex flex-col w-44">
                <input
                  type="text"
                  className="border border-gray-300 rounded py-1 px-2 [&:disabled]:cursor-not-allowed w-full"
                  {...register(`branches.${index}.name` as const)}
                  defaultValue={field.name}
                  readOnly={field.name === 'main'}
                  disabled={field.name === 'main'}
                  placeholder="Branch name"
                />
                {errors.branches?.[index]?.name && (
                  <span className="text-red-500">
                    {errors.branches[index].name.message}
                  </span>
                )}
              </div>
              <Toggle
                {...register(`branches.${index}.enable` as const)}
                defaultChecked={field.enable}
              />
              {field.name !== 'main' && (
                <button
                  className="w-fit bg-transparent p-2"
                  type="button"
                  onClick={() => remove(index)}
                >
                  <MdOutlineClose />
                </button>
              )}
            </div>
          ))}
          <button
            className="w-fit bg-transparent p-2"
            type="button"
            onClick={() =>
              append({
                name: '',
                enable: true,
              })
            }
          >
            <MdAdd />
          </button>
          <button
            className="!mt-8 bg-emerald-400 text-white font-semibold"
            type="submit"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
