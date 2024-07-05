import {PizzaIcon} from "lucide-react";

const PizzaHeader = () => {
    return (
        <>
            <section className="w-full relative">
                <img
                    src="https://img.freepik.com/premium-photo/fresh-homemade-italian-pizza-margherita-with-buffalo-mozzarella-basil_914391-419.jpg"
                    alt="Delicious pizza"
                    width={1920}
                    height={1080}
                    className="w-full h-[80vh] object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4 md:px-6">
                    <div className="space-y-4 max-w-2xl flex flex-col items-center">
                        <PizzaIcon className="h-20 w-20 text-white"/>
                        <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                            Moldi&apos;s Pizza
                        </h1>
                        <p className="text-lg text-white/80 md:text-xl">
                            Experience the best pizza in town, made with the freshest ingredients and delivered straight
                            to your
                            doorstep.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PizzaHeader;