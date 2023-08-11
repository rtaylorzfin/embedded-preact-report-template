import './style.css';
import { Component, h, render } from 'preact';
import { useState } from 'preact/hooks';
import globalReportData from './report.js';

window.UNIPROT_DIFF_REPORT = globalReportData;

function ReportItem({ label, value, onClick }) {
    function handleClick(e) {
        e.preventDefault();
        console.log(value);
        onClick(label);
    }

    return <li>
                <a href="#" onClick={handleClick}>
                    {label}: {value}
                </a>
            </li>
}


function App({reportData}) {
    const [showAddedSequences, setShowAddedSequences] = useState(false);
    const [showSequenceDetail, setShowSequenceDetail] = useState(false);
    const [showSequenceDiff, setShowSequenceDiff] = useState(false);
    const [sequenceDetail, setSequenceDetail] = useState(null);
    const [sequenceDiff, setSequenceDiff] = useState(null);
    const [activeSection, setActiveSection] = useState('none');

    function handleSummaryClick(label) {
        setActiveSection(label);
        setShowSequenceDetail(false);
    }

    function handleSequenceClick(seq) {
        console.log("seq", seq);
        setShowSequenceDetail(true);
        setSequenceDetail(seq.rawData);
    }

    function handleChangedSequenceClick(diff) {
        console.log("diff", diff);
        setSequenceDiff(diff);
        setShowSequenceDiff(true);
    }

    return <div id="report">
                <h1>UniProt Diffs Report</h1>
                <h2>Summary</h2>
                <ul>
                    {Object.entries(reportData.summary).map( ([label, value]) =>
                        <ReportItem label={label} value={value} onClick={handleSummaryClick} />
                    )}
                </ul>

                <div style={{display: activeSection === 'added' ? 'block' : 'none'}}>
                    <h2>Added Sequences</h2>
                    <ul>
                        {reportData.addedSequences.map( seq =>
                            <li><a href='#' onClick={() => handleSequenceClick(seq)}>{seq.accession}</a></li>
                        )}
                    </ul>
                </div>

                <div style={{display: activeSection === 'removed' ? 'block' : 'none'}}>
                    <h2>Removed Sequences</h2>
                    <ul>
                        {reportData.removedSequences.map( seq =>
                            <li><a href='#' onClick={() => handleSequenceClick(seq)}>{seq.accession}</a></li>
                        )}
                    </ul>
                </div>

                <div style={{display: activeSection === 'changed' ? 'block' : 'none'}}>
                    <h2>Changed Sequences</h2>
                    <ul>
                        {reportData.changedSequences.map( diff =>
                            <li><a href='#' onClick={() => handleChangedSequenceClick(diff)}>{diff.accession}</a></li>
                        )}
                    </ul>
                </div>

                <div style={{display: showSequenceDetail ? 'block' : 'none'}}>
                    <h2>Sequence Detail</h2>
                    <pre dangerouslySetInnerHTML={{__html: sequenceDetail}}></pre>
                </div>

                <div style={{display: showSequenceDiff ? 'block' : 'none'}}>
                    <h2>Sequence Changes</h2>
                    <h3>Added Accessions</h3>
                    <ul>
                        {sequenceDiff && sequenceDiff.addedCrossRefs.map( xref =>
                            <li>{xref.dbName}: {xref.accession}</li>
                        )}
                    </ul>
                    <h3>Removed Accessions</h3>
                    <ul>
                        {sequenceDiff && sequenceDiff.removedCrossRefs.map( xref =>
                            <li>{xref.dbName}: {xref.accession}</li>
                        )}
                    </ul>
                    <h3>Added Keywords</h3>
                    <ul>
                        {sequenceDiff && sequenceDiff.addedKeywords.map( kw =>
                            <li>{kw}</li>
                        )}
                    </ul>
                    <h3>Removed Keywords</h3>
                    <ul>
                        {sequenceDiff && sequenceDiff.removedKeywords.map( kw =>
                            <li>{kw}</li>
                        )}
                    </ul>

                </div>


            </div>
          ;
}

document.addEventListener('DOMContentLoaded', () => {
    render(<App reportData={window.UNIPROT_DIFF_REPORT} />, document.body)
});