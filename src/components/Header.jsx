import React from 'react';

const Header = () => {
  return (
    <header className="p-6 flex justify-evenly w-full h-100">
      <div className='w-9/12 flex justify-center'>
        <div className="mx-4 flex flex-col justify-evenly w-full">
          <h1 className="w-fit md:w-fit text-2xl md:text-5xl font-bold px-2">
            The best free stock photos, royalty free images & videos shared by creators.
          </h1>
          <form className="mt-4">
            <input
              type="text"
              className="px-5 bg-gray-100 py-4 md:w-full w-full rounded-xl border-none shadow-lg "
              placeholder="Search"
            />
          </form>
        </div>
      </div>

      <section className="flex gap-4 w-5/12  justify-evenly items-center p-2">
        <div
          className="w-60 h-60 shadow bg-[url('https://tse4.mm.bing.net/th/id/OIP.cKTq4enAGO_Wg_Omp0ysngHaEK?rs=1&pid=ImgDetMain&o=7&rm=3')] bg-cover bg-center rounded-lg"
        />
        <div
          className="w-60 h-60 shadow bg-[url('https://th.bing.com/th/id/R.c87905671a57c838d3ff1caf77d14f83?rik=ZptCnWiDEgGpZg&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f10%2fNature-background-free-download.jpg&ehk=wbfzy%2fd3QxDMgdcz9AQxBMLz6RGbsNRs%2fy31NNNacZ8%3d&risl=&pid=ImgRaw&r=0')] bg-cover bg-center rounded-lg"
        />
      </section>
    </header>
  );
};

export default Header;
