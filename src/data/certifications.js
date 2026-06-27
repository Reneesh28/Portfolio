import googleNetworking from "../assets/images/google-computer-networking.webp";
import coloradoNetworking from "../assets/images/colorado-network-communication.webp";
import freeCodeCampRWD from "../assets/images/freecodecamp-responsive-web-design.webp";

const certifications = [
  {
    title: "The Bits and Bytes of Computer Networking",
    issuer: "Google (Coursera)",
    year: "2024",
    tags: ["Computer Networks", "TCP/IP", "DNS", "OSI Model"],
    file: googleNetworking
  },
  {
    title: "Fundamentals of Network Communication",
    issuer: "University of Colorado (Coursera)",
    year: "2024",
    tags: ["Networking", "Protocols", "Communication Models"],
    file: coloradoNetworking
  },
  {
    title: "Legacy Responsive Web Design",
    issuer: "freeCodeCamp",
    year: "2023",
    tags: ["HTML", "CSS", "Responsive Design"],
    file: freeCodeCampRWD
  }
];

export default certifications;
