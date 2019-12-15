import React, { useState } from 'react';
import { XYPlot, LineSeries, XAxis, YAxis, MarkSeries, DiscreteColorLegend, VerticalBarSeries, RadarChart } from 'react-vis';
import {Button, Dropdown, Checkbox, Input} from 'semantic-ui-react';
import 'react-vis/dist/style.css';
import {getAllKeys, preProcess, formatKeys, getDomains, rMapped} from './util';
import { default as data } from '../../ufcdata/data.json';
import { Container, TitleContainer, RVal, CheckboxContainer, PlotContainer, SubPlot } from './Visualizations.styled';

const Visualizations = ({signOut}) => {
    const [selected, setSelected] = useState('age');
    const [radio, setRadio] = useState('scatter')
    const [inputVal, setInputVal] = useState(0.4);
    const { plotData, max, linearFit, r, r2 } = preProcess(data, selected);
    const legendItems = [{title: 'data', color: '#79C7E3'}, {title: 'linear fit', color: 'black'}];
    const keys = getAllKeys(data);
    const handleDropdown = (e, {value}) => setSelected(value);
    const {radarD, names} = rMapped(data, inputVal);
    const domains = getDomains(names);

    const radarData = [radarD.reduce((acc, cur) => ({...acc, [cur.name]: cur.r, }), { fill: '#79C7E3', stroke: '#2cbdf1'})];
    const edgeData = [keys.reduce((acc, cur) => ({...acc, [cur]: 1 }), { fill: '#fff', stroke: '#ccc'})];

    const DATA = [
        ...edgeData,
        ...radarData,
      ];


    return(
        <Container>
            <PlotContainer>
                <SubPlot>
                    <TitleContainer>
                        <CheckboxContainer>
                            <Checkbox
                                radio
                                label='Scatter'
                                name='checkboxRadioGroup'
                                value='scatter'
                                checked={radio === 'scatter'}
                                onChange={(e, {value}) => setRadio(value)}
                            />
                            <Checkbox
                                radio
                                label='Bar'
                                name='checkboxRadioGroup'
                                value='bar'
                                checked={radio === 'bar'}
                                onChange={(e, {value}) => setRadio(value)}
                            />
                        </CheckboxContainer>
                        <Dropdown
                            placeholder='Select Category'
                            selection
                            options={formatKeys(keys)}
                            value={selected}
                            onChange={handleDropdown}
                        />
                    </TitleContainer>
                    <XYPlot width={500} height={500}>
                        <DiscreteColorLegend items={legendItems} style={{position: 'absolute', top: '0'}} />
                        <RVal>
                            <span>R: {r}</span>
                            <span>R2: {r2}</span>
                        </RVal>
                        <XAxis title={`+${selected} difference`}/>
                        <YAxis tickValues={[0, 25, 50, 75, 100]} tickFormat={v => `${v}%`} on0 title="Win percentage"/>
                        { radio === 'scatter' ? <MarkSeries
                            data={plotData}
                            size={3}
                            color="#79C7E3"
                        /> : <VerticalBarSeries data={plotData} color="#79C7E3" />}
                        <LineSeries data={linearFit} color="black" strokeWidth={1.5} />
                        <LineSeries
                            strokeWidth={0}
                            data={[{x:0,y:0},{x:0,y:100}, {x: -max, y:0 }, {x: max, y: 0}]}
                        />

                    </XYPlot>
                </SubPlot>
                
                <SubPlot>
                        <span>R Value Threshold</span>
                        <TitleContainer>
                            <Button icon="minus" onClick={() => inputVal > 0 && setInputVal(prev => (Number(prev) - 0.1).toPrecision(1))} />
                            <Input value={inputVal} disabled />
                            <Button icon="plus" onClick={() => inputVal < 1 && setInputVal(prev => (Number(prev) + 0.1).toPrecision(1))} />
                        </TitleContainer>
                        <RadarChart
                            data={DATA}
                            tickFormat={t => {
                            return '';
                            }}
                            domains={domains}
                            width={500}
                            height={500}
                            style={{
                            polygons: {
                                strokeWidth: 3,
                                strokeOpacity: 1,
                                fillOpacity: 0.8
                            },
                            labels: {
                                textAnchor: 'middle'
                            },
                            axes: {
                                line: {
                                fillOpacity: 0.8,
                                strokeWidth: 0.5,
                                strokeOpacity: 0.8
                                },
                                ticks: {
                                fillOpacity: 0,
                                strokeOpacity: 0
                                },
                                text: {}
                            }
                            }}
                            colorRange={['transparent']}
                            hideInnerMostValues
                            renderAxesOverPolygons={true}
                        />
                </SubPlot>
            </PlotContainer>
            <Button primary content="Sign out" onClick={signOut} />
        </Container>
    )
}

export default Visualizations;