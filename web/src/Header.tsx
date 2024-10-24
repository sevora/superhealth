/**
 * This is the header where I put the title and some disclaimer.
 * Including the link to the source code.
 */
function Header() {
    return (
        <div>
            <div className="text-2xl font-medium">Superhealth</div>
            The models in this web-application are ran directly on your browser. No data is sent to an external server that may track
            your inputs and results. The model results are not substitute for professional healthcare advice. Source code is on <a className="text-blue-600" href="https://github.com/sevora/superhealth">Github</a>.
        </div>
    );
}

export default Header;