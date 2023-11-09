import React from "react";

export const ContentPage = (props: { contentId: string }) => {
    return (
        <iframe id={props.contentId} title="External Content" width="100%" height="100%" >
        </iframe>
    )
}