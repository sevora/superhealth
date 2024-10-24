/**
 * This is the header where I put the title and some disclaimer.
 * Including the link to the source code.
 */
function Header() {
    return (
        <div>
            <div className="text-2xl font-medium">Superhealth</div>
            The models in this web-application are ran directly on your browser. Internet connection is needed to load the models. However, no data is sent to an external server that may track
            your inputs and results. All processing happens in-device (your browser). The model results are not substitute for professional healthcare advice. Source code is on <a className="text-blue-600" href="https://github.com/sevora/superhealth">Github</a>.
        </div>
    );
}

export default Header;