import googleNetworking from "../assets/images/google-computer-networking.jpg";
import coloradoNetworking from "../assets/images/colorado-network-communication.jpg";
import freeCodeCampRWD from "../assets/images/freecodecamp-responsive-web-design.png";

const certifications = [
  {
    title: "The Bits and Bytes of Computer Networking",
    house: "House_of_Google",
    id: "GNET-2024-X1",
    hash: "0x7F2A...9C11",
    year: "2024",
    tags: ["TCP/IP", "DNS", "OSI"],
    file: googleNetworking
  },
  {
    title: "Fundamentals of Network Communication",
    house: "House_of_Colorado",
    id: "CNET-2024-V2",
    hash: "0x3D1B...8E42",
    year: "2024",
    tags: ["Protocols", "Communication"],
    file: coloradoNetworking
  },
  {
    title: "Responsive Web Design",
    house: "House_of_CodeCamp",
    id: "FCC-2023-RWD",
    hash: "0x1A8D...7B00",
    year: "2023",
    tags: ["HTML", "CSS", "UI/UX"],
    file: freeCodeCampRWD
  }
];

export default certifications;
