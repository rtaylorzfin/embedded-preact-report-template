import './style.css';

// use react
import React, { useState, render } from 'react';
import reportData from './report.js';


function handleSummaryClick(label) {
    console.log(label);
    if (label === 'added') {
        setShowSequences(!showSequences);
    }
}

function ReportItem({ label, value }) {
    function handleClick(e) {
        e.preventDefault();
        console.log(value);
        handleSummaryClick(label)
    }

    return <li>
                <a href="#" onClick={handleClick}>
                    {label}: {value}
                </a>
            </li>
}


function App({ reportData }) {
    const [showSequences, setShowSequences] = useState(false);

    return <div id="report">
                    <h1>UniProt Diffs Report</h1>
                    <h2>Summary</h2>
                    <ul>
                        {Object.entries(reportData.summary).map( ([label, value]) =>
                            <ReportItem label={label} value={value} />
                        )}
                    </ul>

                    <div>
                        <h2>Added Sequences</h2>
                        <ul>
                            {reportData.addedSequences.map( seq =>
                                    <li>${seq.accession}</li>
                            )}
                        </ul>
                    </div>
                </div>
          ;
}


function renderApp() {
    const data = reportData;
    render(<App reportData={data} />, document.body);
}

window.addEventListener('DOMContentLoaded', renderApp);