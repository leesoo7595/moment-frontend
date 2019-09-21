import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import Modal from "./Modal";

export default function MarkerText(props) {
    const {lat, lng} = props;
    const [open, setOpen] = useState(false);

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log("DB에 보내기");
    };

    return (
        <>
            <Button color={"primary"} variant={"contained"} onClick={handleOpenModal}>
                장소 등록하기</Button>
            {
                open && <Modal open={open} handleClose={handleCloseModal}>
                    <form onSubmit={handleSubmit}>

                        <Button type={"submit"} color={"primary"} variant={"contained"}>
                            저장
                        </Button>
                    </form>
                </Modal>
            }
        </>
    )
}