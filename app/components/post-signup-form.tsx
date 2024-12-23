"use client";
import { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import TextReadInput from "./text-read-input";
import { sendCalUserData } from "../actions/sendCalUserData";
import { sendSchoolData } from "../actions/sendSchoolData";

interface PostSignupFormProps {
  neonUser: {
    first_name?: string;
    last_name?: string;
    prefix?: string;
    mobile?: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  member?: Member;
  neonSchoolData?: NeonSchoolData;
}

export default function PostSignupForm({
  neonUser,
  user,
  member,
  neonSchoolData,
}: PostSignupFormProps) {
  const [formData, setFormData] = useState({
    first_name: neonUser?.first_name,
    last_name: neonUser?.last_name,
    prefix: neonUser?.prefix,
    mobile: neonUser?.mobile,
    school: "", // This is a string to store the school name
    schoolData: null as schoolImport | null,
  });

  const handleCancelSearchClick = () => {
    setFormData({
      ...formData,
      school: "",
      schoolData: null,
    });
  };

  const [schools, setSchools] = useState<schoolImport[]>([]);

  useEffect(() => {
    async function fetchSchools() {
      const response = await fetch("/data/schooldata20220930.json");
      const data = await response.json();
      const parsedData = data.map((school: schoolImport) => ({
        ...school,
        Id: Number(school.Id),
      }));
      setSchools(parsedData);
    }
    fetchSchools();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchoolSelection = (school: schoolImport) => {
    setFormData((prev) => ({
      ...prev,
      school: school.establishmentName,
      schoolData: school,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    sendCalUserData(neonUser, formData);
    sendSchoolData(neonUser, formData);
  };

  return (
    <div>
      <div className=" text-3xl text-black font-extrabold ">
        <h1>We need some more information...</h1>
        <form>
          <TextReadInput
            label="First Name"
            type="text"
            name="first_name"
            value={neonUser[0]?.first_name || formData?.first_name}
            placeholder="First Name"
            onChange={handleChange}
          />
          <TextReadInput
            label="Last Name"
            type="text"
            name="last_name"
            value={neonUser[0]?.last_name || formData?.last_name}
            placeholder="Last Name"
            onChange={handleChange}
          />
          <TextReadInput
            label="Prefix"
            type="text"
            name="prefix"
            value={neonUser[0]?.prefix || formData?.prefix}
            placeholder="Prefix"
            onChange={handleChange}
          />
          <TextReadInput
            label="Mobile"
            type="text"
            name="mobile"
            value={neonUser[0]?.mobile || formData?.mobile}
            placeholder="Mobile"
            onChange={handleChange}
          />
          <div className="mt-4 px-4 py-2 border rounded">
            <TextReadInput
              label="School"
              type="text"
              name="school"
              value={neonSchoolData[0]?.school_name || formData?.school}
              onChange={(e) => {
                const query = e.target.value;
                setFormData({ ...formData, school: query });
              }}
            />
          </div>

          {formData.school && formData.school.length > 0 && (
            <div>
              <ul className="border mt-2">
                {schools
                  .filter((school) =>
                    school.establishmentName
                      .toLowerCase()
                      .includes(formData.school.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((school) => (
                    <li
                      key={school.Id}
                      onClick={() => handleSchoolSelection(school)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {school.establishmentName} - {school.town}
                    </li>
                  ))}
              </ul>
              <button
                className="bg-red-600 text-lg text-white px-3 py-2 rounded mt-3 m-2"
                onClick={handleCancelSearchClick}
              >
                Cancel Input
              </button>
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-lg text-white px-3 py-2 rounded mt-3 m-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
        <div className="flex justify-between"></div>
      </div>
      <div>
        <SignOutButton />
      </div>
      Neon data
      <pre>{JSON.stringify(neonUser, null, 2)}</pre>
      <div>
        Clerk data
        <pre>{JSON.stringify(user, null, 2)}</pre>;
      </div>
      <div>
        Full form data
        <pre>{JSON.stringify(formData, null, 2)}</pre>;
      </div>
      <div>
        Member info
        <pre>{JSON.stringify(member, null, 2)}</pre>
      </div>
      <div>
        Neon School Data
        <pre>{JSON.stringify(neonSchoolData, null, 2)}</pre>
      </div>
    </div>
  );
}
