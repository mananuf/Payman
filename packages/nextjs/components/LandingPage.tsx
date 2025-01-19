import React, { useState } from 'react'
import Modal from "~~/components/modal/modal";
import Hero from "../components/Hero"


const LandingPage = () => {
    const [modalOpen, setModalOpen] = useState(false)
  return (
    <div>
         <div className="relative isolate px-6  lg:px-8">
                <div className="mx-auto max-w-2xl py-5 sm:py-28 lg:py-32">
                <Hero/>
                  <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                    <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                      Announcing our next round of funding.{' '}
                      <a href="#" className="font-semibold text-blue-600">
                        <span aria-hidden="true" className="absolute inset-0" />
                        Read more <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                  <div className="text-center mt-10 md:mt-0">
                    <h1 className="text-3xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
                      Seamless Payments, Globally Accessible
                    </h1>
                    <p className="mt-8 text-base md:text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    Empowering social vendors and individuals with seamless crypto-to-fiat payment solutions, bridging borders and breaking barriers for a truly global marketplace.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                      <a
                        href="/register"
                        onClick={() => setModalOpen(true)}
                        className="rounded-full bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Get started
                      </a>
                      <a href="#" className="text-sm/6 font-semibold text-blue-600 rounded-full border-2 px-3.5 py-1  border-blue-600">
                        Learn more
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                  <div
                    style={{
                      clipPath:
                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#8082ff] to-[#4339ce] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                  />
                </div>
              </div>

              {/* modal */}
                {modalOpen && (
                      <Modal 
                        title="Create Username" 
                        actionButton={{label: 'register'}} 
                        cancelBtn={ false }
                        content={
                          <div>
                            <p className="mt-1 text-xs text-gray-600">
                              This will create a unique username that identifies your wallet address for ease of transaction.
                            </p>
                            <div className="mt-5">
                              <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600">
                                <input
                                  id="username"
                                  name="username"
                                  type="text"
                                  placeholder="Enter Username"
                                  className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                />
                                <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6 mr-1">payman.Strk</div>
                              </div>
                            </div>
                          </div>
                        }
                      />
                      )}
    </div>
  )
}

export default LandingPage