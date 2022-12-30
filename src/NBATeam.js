import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Row, Col } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AiOutlineSearch } from "react-icons/ai";

export default function NBATeam() {

    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamGames, setTeamGames] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedTeamColorFlag, setSelectedTeamColorFlag] = useState(0);
    const [inputText, setInputText] = useState("")

    const handleClose = () => {
        setShow(false);
        setSelectedTeamColorFlag(0);
    }

    const handleInputSearch = (e) => {
        setInputText(e.target.value);
    }

    async function getTeams() {
        const response = await fetch('https://www.balldontlie.io/api/v1/teams');
        const data = await response.json();
        return data;
    }

    async function getTeamGames(teamId) {
        const response = await fetch(`https://www.balldontlie.io/api/v1/games?seasons[]=2021&team_ids[]=${teamId}`);
        const data = await response.json();
        return data;
    }

    const showTeamInfo = team => {
        setShow(true);
        setSelectedTeamColorFlag(1)
        setSelectedTeam(team);
        getTeamGames(team.id).then(data => setTeamGames(data.data));


    }

    useEffect(() => {
        getTeams().then(data => setTeams(data.data));
    }, []);

    return (
        <>
            <div className="header">NBA TEAMS</div>
            <input type="text" value={inputText} onChange={(e) => handleInputSearch(e)} className='search-box' />
            <button className='search-icon'><AiOutlineSearch /></button>

            <Table striped bordered hover responsive size="sm" className='table'>
                <thead className='table-header'>
                    <tr>
                        <th>Team Name</th>
                        <th>City</th>
                        <th>Abbreviation</th>
                        <th>conference</th>
                        <th>Division</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()))
                    .map(team => (
                        <tr key={team.id} onClick={() => showTeamInfo(team)} className={(selectedTeamColorFlag && team.id === selectedTeam.id) ? "selected-item" : null}>
                            <td>{team.name}</td>
                            <td>{team.city}</td>
                            <td>{team.abbreviation}</td>
                            <td>{team.conference}</td>
                            <td>{team.division}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {teamGames.length !== 0 ? <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton className='sidebar-title'>
                    <Offcanvas.Title>{selectedTeam.name}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='sidebar-body'>
                    <Row>
                        <Col>Team Full Name </Col>
                        <Col>{selectedTeam.full_name}</Col>
                    </Row>
                    <Row>
                        <Col>Total Game in 2021 </Col>
                        <Col>{teamGames.length}</Col>
                    </Row>
                    <div className='team-game-detail'>
                        <Row>
                            <Col>Random Game Details </Col>
                        </Row>
                        <Row>
                            <Col>Date </Col>
                            <Col>{teamGames[0].date}</Col>
                        </Row>
                        <Row>
                            <Col>Home Team </Col>
                            <Col>{teamGames[0].home_team.name}</Col>
                        </Row>
                        <Row>
                            <Col>Home Team Score </Col>
                            <Col>{teamGames[0].home_team_score}</Col>
                        </Row>
                        <Row>
                            <Col>Visitor Team </Col>
                            <Col>{teamGames[0].visitor_team.name}</Col>
                        </Row>
                        <Row>
                            <Col>Visitor Team Score </Col>
                            <Col>{teamGames[0].visitor_team_score}</Col>
                        </Row>
                    </div>
                </Offcanvas.Body>
            </Offcanvas> : null
            }

        </>
    )
}