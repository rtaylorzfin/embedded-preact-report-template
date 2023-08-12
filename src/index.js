import { Component, h, render } from 'preact';
import { useState } from 'preact/hooks';

function ReportItem({ label, value, onClick }) {
    function handleClick(e) {
        e.preventDefault();
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
    const [changeFilter, setChangeFilter] = useState(null);

    function handleSummaryClick(label) {
        setActiveSection(label);
        if (label === 'changed') {
            setChangeFilter(null);
        }
        if (label === 'changed GeneID') {
            setChangeFilter('GeneID');
        }
        if (label === 'changed RefSeq') {
            setChangeFilter('RefSeq');
        }
        if (label === 'changed ZFIN') {
            setChangeFilter('ZFIN');
        }
        if (label.includes('changed')) {
            setActiveSection('changed');
        }
        setShowSequenceDetail(false);
        setShowSequenceDiff(false);
    }

    function handleSequenceClick(seq) {
        setShowSequenceDetail(true);
        setSequenceDetail(seq.rawData);
    }

    function handleChangedSequenceClick(diff) {
        setSequenceDiff(diff);
        setShowSequenceDiff(true);
    }

    if (reportData === null) {
        return <div><h4>No Report Data Provided</h4></div>
    }

    return <div id="report">
                <h1>UniProt Diffs Report</h1>
                <h2 style={{textAlign: 'center'}}>Changes from May 2023 to June 2023</h2>
                <div id='content'>
                <div id="left-nav">
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
                                {reportData.changedSequences
                                    .filter( diff => changeFilter === null ||
                                        diff.addedCrossRefs.some( xref => xref.dbName === changeFilter) ||
                                        diff.removedCrossRefs.some( xref => xref.dbName === changeFilter))
                                    .map( diff =>
                                    <li><a href='#' onClick={() => handleChangedSequenceClick(diff)}>{diff.accession}</a></li>
                                )}
                            </ul>
                        </div>
                </div>
                <div id="right-content">
                        <div style={{display: showSequenceDetail ? 'block' : 'none'}}>
                            <h2>Sequence Detail</h2>
                            <pre style={{width: '1000px', overflow: 'scroll'}} dangerouslySetInnerHTML={{__html: sequenceDetail}}></pre>
                        </div>

                        <div style={{display: showSequenceDiff ? 'block' : 'none'}}>
                            <h2>Sequence Changes for {sequenceDiff && sequenceDiff.accession}</h2>
                            <h3>Added Accessions</h3>
                            <ul>
                                {sequenceDiff && sequenceDiff.addedCrossRefs.map( xref =>
                                    <li>{xref.dbName}: {xref.accession}</li>
                                )}
                                {sequenceDiff && sequenceDiff.addedCrossRefs.length === 0 &&
                                    <li>None</li>}
                            </ul>
                            <h3>Removed Accessions</h3>
                            <ul>
                                {sequenceDiff && sequenceDiff.removedCrossRefs.map( xref =>
                                    <li>{xref.dbName}: {xref.accession}</li>
                                )}
                                {sequenceDiff && sequenceDiff.removedCrossRefs.length === 0 &&
                                    <li>None</li>}
                            </ul>
                            {/*<h3>Added Keywords</h3>*/}
                            {/*<ul>*/}
                            {/*    {sequenceDiff && sequenceDiff.addedKeywords.map( kw =>*/}
                            {/*        <li>{kw}</li>*/}
                            {/*    )}*/}
                            {/*</ul>*/}
                            {/*<h3>Removed Keywords</h3>*/}
                            {/*<ul>*/}
                            {/*    {sequenceDiff && sequenceDiff.removedKeywords.map( kw =>*/}
                            {/*        <li>{kw}</li>*/}
                            {/*    )}*/}
                            {/*</ul>*/}
                            <h3>Details</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Old Value</th>
                                        <th>New Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {sequenceDiff && <pre style={{width: '800px', overflow: 'scroll'}} dangerouslySetInnerHTML={{__html: sequenceDiff.oldSequence.rawData}}></pre>}
                                        </td>
                                        <td>
                                            {sequenceDiff && <pre style={{width: '800px', overflow: 'scroll'}} dangerouslySetInnerHTML={{__html: sequenceDiff.newSequence.rawData}}></pre>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                </div>
                </div>
            </div>
          ;
}

document.addEventListener('DOMContentLoaded', () => {
    render(<App reportData={window.UNIPROT_DIFF_REPORT} />, document.body)
});