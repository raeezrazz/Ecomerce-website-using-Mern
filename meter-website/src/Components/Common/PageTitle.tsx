import React from "react";


interface PageTitleProps {
  Header: string;
  Discription: string;
}
const PageTitle: React.FC<PageTitleProps> = ({ Header, Discription }) => { 
   return (
    <div className="bg-gray-100 py-4 mt-4 rounded-md   text-center">
      <h1 className="text-4xl font-bold text-gray-800">{Header}</h1>
      <p className="text-sm text-gray-600 mt-2">
       {Discription}
      </p>
    </div>
  );
};

export default PageTitle;
