import Pagination from "@mui/material/Pagination";
import "../../styles/UsersTableFooter.scss";

function UsersTableFooter(props: {
    numberOfRecordsToDisplay: number,
    totalNumberOfRecords: number,
    page: number,
    updateRecordsDisplayed: Function,
    updatePage: Function,
    numPages: number
}) {

    const updateNumberOfRecordsToDisplay = (ev: any) => {
        props.updateRecordsDisplayed(ev.target.value);
    }

    const updatePage = (ev: any, value: number) => {
        props.updatePage(value)
    }
    return (
        <div className="table-footer">
            <div className="num-records">
                <span>Showing </span>
                <select
                    name="numRecordsToDisplay"
                    value={
                        props.totalNumberOfRecords > props.numberOfRecordsToDisplay ?
                        props.numberOfRecordsToDisplay :
                        props.totalNumberOfRecords
                    }
                    onChange={updateNumberOfRecordsToDisplay}
                >
                    {
                        props.totalNumberOfRecords < props.numberOfRecordsToDisplay ?
                        <option value={props.totalNumberOfRecords}>{props.totalNumberOfRecords}</option> :
                        <>
                            <option value="10">10</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </>
                    }  
                </select>
                <span> out of {props.totalNumberOfRecords}</span>
            </div>
            {props.numPages > 1 ? <Pagination count={props.numPages} page={props.page} onChange={updatePage} shape="rounded" /> : <></>}
        </div>
    )
}

export default UsersTableFooter;