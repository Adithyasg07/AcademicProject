import React from "react";

const Termsandconditions = () => {
    return (
        <div className="bg-green-100 w-full">
            {/* Breadcrumb */}
            <div className="px-4 sm:px-6 md:px-20 pt-4 sm:pt-6 text-xs sm:text-sm text-[#8b5a2b]">
                <span className="cursor-pointer hover:underline">Home</span>
                <span className="mx-1">_</span>
                <span className="font-medium">Terms And Conditions</span>
            </div>

            {/* Content Wrapper */}
            <div className="px-4 sm:px-6 md:px-20 py-8 sm:py-12 max-w-7xl mx-auto">
                {/* Heading */}
                <h1 className="text-6xl sm:text-6xl md:text-5xl font-bold text-[#5a3414] mb-6 sm:mb-8 text-center">
                    Terms and Conditions
                </h1>

                {/* Intro Paragraph */}
                <p className="text-sm sm:text-base text-gray-700 leading-6 sm:leading-7 mb-5 sm:mb-6">
                    Welcome to our website. If you continue to browse and use this website
                    you are agreeing to comply with and be bound by the following terms
                    and conditions of use, which together with our privacy policy govern
                    Mehrotra Consumer Products Pvt. Ltd’s relationship with you in relation
                    to this website.
                </p>

                <p className="text-sm sm:text-base text-gray-700 leading-6 sm:leading-7 mb-5 sm:mb-6">
                    The term ‘Mehrotra Consumer Products Pvt. Ltd.’ or ‘us’ or ‘we’ refers
                    to the owner of the website whose registered office is 26G, Sector 31,
                    Ecotech I, Greater Noida, UP 201308. Our company registration number is
                    U15122UP2012PTC049728, given at Kanpur. The term ‘you’ refers to the user
                    or viewer of our website.
                </p>

                {/* Subheading */}
                <p className="text-sm sm:text-base font-medium text-gray-800 mb-3 sm:mb-4">
                    The use of this website is subject to the following terms of use:
                </p>

                {/* Bullet Points */}
                <ul className="list-disc pl-4 sm:pl-6 space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700 leading-6 sm:leading-7">
                    <li>
                        The content of the pages of this website is for your general
                        information and use only. It is subject to change without notice.
                    </li>

                    <li>
                        Neither we nor any third parties provide any warranty or guarantee
                        as to the accuracy, timeliness, performance, completeness or
                        suitability of the information and materials found or offered on
                        this website for any particular purpose.
                    </li>

                    <li>
                        Your use of any information or materials on this website is entirely
                        at your own risk, for which we shall not be liable.
                    </li>

                    <li>
                        This website contains material which is owned by or licensed to us,
                        including the design, layout, look, appearance and graphics.
                        Reproduction is strictly prohibited.
                    </li>

                    <li>
                        Unauthorized use of this website may give rise to a claim for
                        damages and/or be a criminal offence.
                    </li>
                </ul>
                <div className="bg-green-200 w-full">
                    <div className="px-4 sm:px-6 md:px-20 py-8 sm:py-10 max-w-7xl mx-auto">
                        {/* Bullet Section */}
                        <ul className="list-disc pl-4 sm:pl-6 space-y-6 text-sm sm:text-base text-gray-700 leading-6 sm:leading-7">
                            <li>
                                When You visit Organic Tattva website or send emails to us, You are
                                communicating with us electronically. We communicate with You by
                                email, SMS, RCS or by posting notices on the website. For contractual
                                purposes, You consent to receive communications from us
                                electronically and You agree that all agreements, notices,
                                disclosures and other communications that we provide to You
                                electronically satisfy any legal requirement that those
                                communications be in writing. This condition does not affect Your
                                statutory rights. You understand that once You register as an
                                Organic Tattva user on the Organic Tattva platform, Upon placing any
                                order on our website, we shall be entitled to use your registered
                                mobile number on the website to send transaction related SMS to you,
                                irrespective of DND services being activated on your mobile. We may
                                occasionally send promotional SMS or RCS to your registered mobile
                                number. Customer hereby authorizes us to send transactional SMS to
                                his registered number, even if the number is registered for DND
                                "Do not Disturb" service.
                            </li>

                            <li>
                                When you voluntarily send us electronic mail / fill up the form, we
                                will keep a record of this information so that we can respond to
                                you. We only collect information from you when you register on our
                                site or fill out a form. Also, when filling out a form on our site,
                                you may be asked to enter your: name, e-mail address or phone
                                number. You may, however, visit our site anonymously. In case you
                                have submitted your personal information and contact details, we
                                reserve the rights to Call, SMS, Email or WhatsApp about our
                                products and offers, even if your number has DND activated on it.
                            </li>
                        </ul>

                        {/* Discount Section */}
                        <div className="mt-10">
                            <h2 className="text-lg sm:text-3xl font-semibold text-gray-900 mb-3 text-center">
                                Discount &amp; Offer
                            </h2>

                            <p className="text-sm sm:text-base text-gray-700 leading-6 sm:leading-7 text-center ">
                                The 25% discount offered under the coupon code{" "}
                                <span className="font-medium">YEAREND25</span> comprises a 20%
                                discount applied via the coupon code and a 5% discount that is
                                automatically pre-applied on the website.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Termsandconditions;