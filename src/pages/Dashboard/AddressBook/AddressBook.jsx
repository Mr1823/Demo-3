import React, { useEffect, useState } from "react";
import useUserInfo from "../../../hooks/useUserInfo";
import { useForm } from "react-hook-form";
import { City, Country, State } from "country-state-city";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";

const AddressBook = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();
  
  const [userFromDB, , refetch] = useUserInfo();
  const [shippingAdd, setShippingAdd] = useState(null);
  const [axiosSecure] = useAxiosSecure();
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (userFromDB?.shippingAddress) {
      setShippingAdd(userFromDB.shippingAddress);
      setIsFormVisible(false);
    } else {
      setShippingAdd(null);
    }
  }, [userFromDB]);

  const countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [countryCode, setCountryCode] = useState(countryData[0]?.isoCode);
  const [stateCode, setStateCode] = useState("");

  useEffect(() => {
    setStateData(State.getStatesOfCountry(countryCode));
  }, [countryCode]);

  useEffect(() => {
    if (stateData.length > 0) {
      setStateCode(stateData[0]?.isoCode);
    }
  }, [stateData]);

  useEffect(() => {
    if (countryCode && stateCode) {
      const cities = City.getCitiesOfState(countryCode, stateCode);
      if (cities.length) {
        setCityData(cities);
      } else {
        const allCities = City.getCitiesOfCountry(countryCode);
        const citiesOfState = allCities.filter((city) => city.stateCode === stateCode);
        setCityData(citiesOfState);
      }
    }
  }, [stateCode, countryCode]);

  const [phoneNumInfo, setPhoneNumInfo] = useState(0);
  useEffect(() => {
    axios
      .get("https://71f90181a2134520be0e927a52b5cdc6.api.mockbin.io/")
      .then((res) => {
        const data = res.data;
        const countryDetails = data.find(
          (country) =>
            country.code.toLowerCase() ===
            Country.getCountryByCode(countryCode).isoCode.toLowerCase()
        );
        setPhoneNumInfo({
          phoneCode: countryDetails.phone,
          numberLength: parseInt(countryDetails.phoneLength),
        });
      })
      .catch(() => {
        setPhoneNumInfo(30);
      });
  }, [stateData, countryCode]);

  useEffect(() => {
    if (userFromDB) {
      let defaultValues = {};
      defaultValues.firstName = userFromDB?.name?.split(" ")[0] || "";
      defaultValues.lastName = userFromDB?.name?.split(" ")[userFromDB?.name?.split(" ")?.length - 1] || "";
      reset({ ...defaultValues });
    }
  }, [userFromDB, reset]);

  const onSubmit = (data) => {
    const stateName = State.getStateByCodeAndCountry(data.state, data.country)?.name || data.state;
    const countryName = Country.getCountryByCode(data.country)?.name || data.country;
    
    data.state = stateName;
    data.country = countryName;
    data.number = `+${phoneNumInfo?.phoneCode || ''} ${data.mobileNumber}`;

    axiosSecure
      .patch(`/users/shipping-address?email=${data.email}`, data)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          toast.success("Shipping address saved");
          refetch();
          setIsFormVisible(false);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteAddress = () => {
    axiosSecure
      .patch(`/users/delete-address?email=${userFromDB?.email}`)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          toast.success("Address removed");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="w-full">
      <header className="mb-12">
        <span className="font-body text-[12px] font-semibold text-secondary tracking-[0.2em] uppercase block mb-2">
          Your Account
        </span>
        <h1 className="font-display text-5xl md:text-6xl text-primary">Address Book</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Address Button (Only show if form is hidden and we have less than 2 addresses conceptually, but for now just toggle form) */}
        {!isFormVisible && !shippingAdd && (
          <button 
            onClick={() => setIsFormVisible(true)}
            className="border-2 border-dashed border-primary/40 h-64 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-primary/5 hover:border-primary border-solid transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined">add</span>
            </div>
            <span className="font-body text-sm font-semibold text-primary uppercase tracking-widest">
              Add New Address
            </span>
          </button>
        )}

        {/* Existing Address Card */}
        {!isFormVisible && shippingAdd && (
          <div className="bg-surface-container border border-outline-variant p-8 flex flex-col justify-between h-64 relative overflow-hidden group transition-all duration-500 hover:shadow-heritage hover:border-outline-variant/80">
            <div>
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-display text-2xl text-primary">
                  {shippingAdd.firstName} {shippingAdd.lastName}
                </h3>
                <span className="px-3 py-1 border border-outline-variant text-[10px] font-body font-bold text-on-surface-variant uppercase tracking-widest bg-surface-variant/30">
                  Default
                </span>
              </div>
              <div className="font-body text-on-surface-variant text-sm space-y-1">
                <p>{shippingAdd.streetAddress}</p>
                <p>{shippingAdd.city}, {shippingAdd.state} - {shippingAdd.postalCode}</p>
                <p>{shippingAdd.country}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">call</span>
                <span className="font-body text-sm">{shippingAdd.number}</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsFormVisible(true)}
                  className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  aria-label="Edit"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button 
                  onClick={handleDeleteAddress}
                  className="text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                  aria-label="Delete"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Form Container */}
      {isFormVisible && (
        <div className="mt-8 bg-surface-container-low border border-outline-variant/30 p-8 max-w-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-8 border-b border-primary/10 pb-4">
            <h4 className="font-display text-2xl text-primary">
              {shippingAdd ? 'Edit Address' : 'New Address'}
            </h4>
            {shippingAdd && (
              <button 
                onClick={() => setIsFormVisible(false)}
                className="text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-focus-line">
                <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">First Name</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body"
                  {...register("firstName", { required: true })}
                />
                {errors.firstName && <span className="text-error text-xs italic mt-1 block">Required</span>}
              </div>

              <div className="input-focus-line">
                <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Last Name</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body"
                  {...register("lastName", { required: true })}
                />
                {errors.lastName && <span className="text-error text-xs italic mt-1 block">Required</span>}
              </div>
            </div>

            <div className="input-focus-line">
              <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Email</label>
              <input
                type="text"
                readOnly
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface opacity-70 cursor-not-allowed font-body"
                {...register("email", { required: true })}
                defaultValue={userFromDB?.email}
              />
            </div>

            <div className="input-focus-line">
              <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Street Address</label>
              <input
                type="text"
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body"
                {...register("streetAddress", { required: true })}
              />
              {errors.streetAddress && <span className="text-error text-xs italic mt-1 block">Required</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-focus-line">
                <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Country</label>
                <select
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body appearance-none cursor-pointer"
                  {...register("country", { required: true })}
                  onChange={(e) => setCountryCode(e.target.value)}
                  defaultValue={countryCode}
                >
                  {countryData?.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-focus-line">
                <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">State / Province</label>
                <select
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body appearance-none cursor-pointer"
                  {...register("state", { required: true })}
                  onChange={(e) => setStateCode(e.target.value)}
                  defaultValue={stateCode}
                >
                  {stateData?.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-focus-line">
                <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">City / Town</label>
                {cityData?.length ? (
                  <select
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body appearance-none cursor-pointer"
                    {...register("city", { required: true })}
                    defaultValue={cityData[0].name}
                  >
                    {cityData.map((city) => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body"
                    {...register("city", { required: true })}
                  />
                )}
              </div>

              <div className="input-focus-line">
                <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Zip / Postal Code</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body"
                  {...register("postalCode", { required: true })}
                />
              </div>
            </div>

            <div className="input-focus-line relative">
              <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Mobile Number</label>
              <div className="flex items-center gap-2">
                <span className="text-on-surface bg-surface-variant px-3 py-2 border-b border-outline-variant">
                  +{Country?.getCountryByCode(countryCode)?.phonecode || ''}
                </span>
                <input
                  type="number"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body"
                  {...register("mobileNumber", { required: "Required" })}
                  onInput={(e) => {
                    if (e.target.value.length > e.target.maxLength)
                      setError("mobileNumber", {
                        type: "maxLength",
                        message: `Max ${phoneNumInfo?.numberLength} digits`,
                      });
                    e.target.value = e.target.value.slice(0, e.target.maxLength);
                  }}
                  maxLength={phoneNumInfo?.numberLength || 15}
                />
              </div>
              {errors?.mobileNumber && <span className="text-error text-xs italic mt-1 block">{errors.mobileNumber.message}</span>}
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                className="px-10 py-4 bg-primary text-white font-body text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300 cursor-pointer"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
