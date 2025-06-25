import { Facebook, Twitter, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer
            className="bg-[#15445A] text-white"
            dir="rtl"
            style={{ fontFamily: "'Helvetica Neue', 'Sakkal Majalla'" }}
        >
            {/* Bottom Footer */}
            <div className="py-1">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0">
                        <div className="text-sm text-white/90 mx-6">
                            &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="فيسبوك"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="تويتر"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="لينكدإن"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="الموقع"
                            >
                                <Globe className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
