const Footer = () => {
    return (
        <footer className="bg-danger text-white mt-5 p-4 text-center">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <p>&copy; {new Date().getFullYear()} Moldi's Pizza. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
