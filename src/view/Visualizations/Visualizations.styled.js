import styled from 'styled-components';

export const Container = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

export const TitleContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 500px;
    margin-bottom: 4em; 
    & > span {
        font-size: 1.5em;
        
    }

    & > .ui.disabled.input {
        width: 5em;

        & > input {
            text-align: center;
        }
    }
`;

export const RVal = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 5em;
    color: black;
`;

export const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: auto;
`;

export const PlotContainer = styled.div`
    display: flex;

    & > div:first-child {
        margin-right: 2em;
    }

    & > div:last-child {
        margin-left: 2em;
    }

    & .rv-xy-plot__axis__line {
        stroke-width: 1px !important;
    }

    & .rv-xy-plot__inner {
        overflow: visible !important;
    }

`;

export const SubPlot = styled.div`
    display: flex;
    flex-direction: column;
`
