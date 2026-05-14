export interface StickerDef {
  id: string;
  number: number;
  name: string;
}

export interface TeamDef {
  id: string;
  name: string;
  flag: string;
  stickers: StickerDef[];
}

export interface ConfederationDef {
  id: string;
  name: string;
  teams: TeamDef[];
}

function ts(code: string, names: string[]): StickerDef[] {
  return names.map((name, i) => ({ id: `${code}${i}`, number: i, name }));
}
function fwc(names: string[]): StickerDef[] {
  return names.map((name, i) => ({ id: `FWC${i + 1}`, number: i + 1, name }));
}

export const CONFEDERATIONS: ConfederationDef[] = [
  {
    id: "ESPECIAL",
    name: "✨ INTRO",
    teams: [
      {
        id: "FWC",
        name: "FIFA World Cup 2026",
        flag: "🏆",
        stickers: fwc([
          "Panini", "Official Emblem /1", "Official Emblem /2", "Official Mascots",
          "Official Slogan", "Official Ball",
          "Host Country Emblem - CAN", "Host Country Emblem - MEX", "Host Country Emblem - USA",
        ]),
      },
    ],
  },
  {
    id: "CONMEBOL",
    name: "🌎 CONMEBOL - Sudamérica",
    teams: [
      {
        id: "ARG", name: "Argentina", flag: "🇦🇷",
        stickers: ts("ARG", ["Argentina Logo", "Emiliano Martínez", "Nahuel Molina", "Cristian Romero", "Nicolás Otamendi", "Enzo Fernández", "Alexis Mac Allister", "Rodrigo De Paul", "Julián Álvarez", "Lionel Messi", "Giuliano Simeone", "Lautaro Martínez"]),
      },
      {
        id: "BRA", name: "Brasil", flag: "🇧🇷",
        stickers: ts("BRA", ["Brazil Logo", "Alisson", "Marquinhos", "Éder Militão", "Gabriel Magalhães", "Casemiro", "Bruno Guimarães", "Vinícius Júnior", "Rodrygo", "Matheus Cunha", "Raphinha", "Estêvão"]),
      },
      {
        id: "URU", name: "Uruguay", flag: "🇺🇾",
        stickers: ts("URU", ["Uruguay Logo", "Sergio Rochet", "José María Giménez", "Ronald Araújo", "Sebastián Cáceres", "Mathías Olivera", "Nahitan Nández", "Federico Valverde", "Rodrigo Bentancur", "Manuel Ugarte", "Facundo Pellistri", "Darwin Núñez"]),
      },
      {
        id: "COL", name: "Colombia", flag: "🇨🇴",
        stickers: ts("COL", ["Colombia Logo", "Camilo Vargas", "Dávinson Sánchez", "Yerry Mina", "Daniel Muñoz", "James Rodríguez", "Jefferson Lerma", "Richard Ríos", "Juan Fernando Quintero", "Luis Díaz", "Jhon Arias", "Luis Suárez"]),
      },
      {
        id: "ECU", name: "Ecuador", flag: "🇪🇨",
        stickers: ts("ECU", ["Ecuador Logo", "Hernán Galíndez", "Piero Hincapié", "Pervis Estupiñán", "Willian Pacho", "Ángelo Preciado", "Kendry Páez", "Moisés Caicedo", "Alan Franco", "Pedro Vite", "Gonzalo Plata", "Enner Valencia"]),
      },
      {
        id: "PAR", name: "Paraguay", flag: "🇵🇾",
        stickers: ts("PAR", ["Paraguay Logo", "Orlando Gill", "Gustavo Gómez", "Juan José Cáceres", "Omar Alderete", "Júnior Alonso", "Diego Gómez", "Andrés Cubas", "Julio Enciso", "Miguel Almirón", "Ramón Sosa", "Antonio Sanabria"]),
      },
    ],
  },
  {
    id: "UEFA",
    name: "🌍 UEFA - Europa",
    teams: [
      {
        id: "FRA", name: "Francia", flag: "🇫🇷",
        stickers: ts("FRA", ["France Logo", "Mike Maignan", "William Saliba", "Jules Koundé", "Théo Hernández", "Aurélien Tchouaméni", "Eduardo Camavinga", "Ousmane Dembélé", "Kylian Mbappé", "Bradley Barcola", "Désiré Doué", "Hugo Ekitiké"]),
      },
      {
        id: "ESP", name: "España", flag: "🇪🇸",
        stickers: ts("ESP", ["Spain Logo", "Unai Simón", "Robin Le Normand", "Dean Huijsen", "Marc Cucurella", "Rodri", "Martín Zubimendi", "Pedri", "Fabián Ruiz", "Lamine Yamal", "Nico Williams", "Mikel Oyarzabal"]),
      },
      {
        id: "GER", name: "Alemania", flag: "🇩🇪",
        stickers: ts("GER", ["Germany Logo", "Marc-André ter Stegen", "Antonio Rüdiger", "Jonathan Tah", "David Raum", "Florian Wirtz", "Joshua Kimmich", "Leon Goretzka", "Jamal Musiala", "Serge Gnabry", "Kai Havertz", "Nick Woltemade"]),
      },
      {
        id: "ENG", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        stickers: ts("ENG", ["England Logo", "Jordan Pickford", "Reece James", "John Stones", "Jude Bellingham", "Declan Rice", "Jordan Henderson", "Phil Foden", "Harry Kane", "Bukayo Saka", "Cole Palmer", "Marcus Rashford"]),
      },
      {
        id: "POR", name: "Portugal", flag: "🇵🇹",
        stickers: ts("POR", ["Portugal Logo", "Diogo Costa", "Rúben Dias", "Nuno Mendes", "Vitinha", "Bernardo Silva", "Bruno Fernandes", "Rúben Neves", "Cristiano Ronaldo", "João Félix", "Pedro Neto", "Rafael Leão"]),
      },
      {
        id: "NED", name: "Países Bajos", flag: "🇳🇱",
        stickers: ts("NED", ["Netherlands Logo", "Bart Verbruggen", "Virgil van Dijk", "Micky van de Ven", "Denzel Dumfries", "Tijjani Reijnders", "Ryan Gravenberch", "Frenkie de Jong", "Xavi Simons", "Memphis Depay", "Donyell Malen", "Cody Gakpo"]),
      },
      {
        id: "BEL", name: "Bélgica", flag: "🇧🇪",
        stickers: ts("BEL", ["Belgium Logo", "Thibaut Courtois", "Arthur Theate", "Timothy Castagne", "Maxim De Cuyper", "Youri Tielemans", "Kevin De Bruyne", "Amadou Onana", "Jérémy Doku", "Charles De Ketelaere", "Leandro Trossard", "Romelu Lukaku"]),
      },
      {
        id: "CRO", name: "Croacia", flag: "🇭🇷",
        stickers: ts("CRO", ["Croatia Logo", "Dominik Livaković", "Duje Ćaleta-Car", "Joško Gvardiol", "Josip Stanišić", "Ivan Perišić", "Luka Modrić", "Mateo Kovačić", "Lovro Majer", "Mario Pašalić", "Ante Budimir", "Andrej Kramarić"]),
      },
      {
        id: "SUI", name: "Suiza", flag: "🇨🇭",
        stickers: ts("SUI", ["Switzerland Logo", "Gregor Kobel", "Manuel Akanji", "Ricardo Rodríguez", "Nico Elvedi", "Silvan Widmer", "Granit Xhaka", "Remo Freuler", "Fabian Rieder", "Breel Embolo", "Rubén Vargas", "Dan Ndoye"]),
      },
      {
        id: "TUR", name: "Türkiye", flag: "🇹🇷",
        stickers: ts("TUR", ["Türkiye Logo", "Uğurcan Çakır", "Mert Müldür", "Abdülkerim Bardakcı", "Merih Demiral", "Ferdi Kadıoğlu", "Hakan Çalhanoğlu", "Orkun Kökçü", "Arda Güler", "Can Uzun", "Kerem Aktürkoğlu", "Kenan Yıldız"]),
      },
      {
        id: "AUT", name: "Austria", flag: "🇦🇹",
        stickers: ts("AUT", ["Austria Logo", "Alexander Schlager", "David Alaba", "Kevin Danso", "Philipp Lienhart", "Konrad Laimer", "Nicolas Seiwald", "Marcel Sabitzer", "Florian Grillitsch", "Marko Arnautović", "Christoph Baumgartner", "Michael Gregoritsch"]),
      },
      {
        id: "BIH", name: "Bosnia y Herzegovina", flag: "🇧🇦",
        stickers: ts("BIH", ["Bosnia-Herzegovina Logo", "Nikola Vasilj", "Amar Dedić", "Sead Kolašinac", "Tarik Muharemović", "Nikola Katić", "Benjamin Tahirović", "Ivan Šunjić", "Ermedin Demirović", "Esmir Bajraktarević", "Edin Džeko", "Amar Memić"]),
      },
      {
        id: "CZE", name: "República Checa", flag: "🇨🇿",
        stickers: ts("CZE", ["Czechia Logo", "Matěj Kovář", "Ladislav Krejčí", "Vladimír Coufal", "Jaroslav Zelený", "Lukáš Provod", "Lukáš Červ", "Tomáš Souček", "Pavel Šulc", "Václav Černý", "Adam Hložek", "Patrik Schick"]),
      },
      {
        id: "SCO", name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        stickers: ts("SCO", ["Scotland Logo", "Angus Gunn", "Aaron Hickey", "Andrew Robertson", "John Souttar", "Grant Hanley", "Scott McTominay", "Lewis Ferguson", "Ryan Christie", "John McGinn", "Ché Adams", "Ben Gannon-Doak"]),
      },
      {
        id: "SWE", name: "Suecia", flag: "🇸🇪",
        stickers: ts("SWE", ["Sweden Logo", "Viktor Johansson", "Isak Hien", "Emil Holm", "Victor Nilsson Lindelöf", "Lucas Bergvall", "Yasin Ayari", "Daniel Svensson", "Dejan Kulusevski", "Anthony Elanga", "Alexander Isak", "Viktor Gyökeres"]),
      },
      {
        id: "NOR", name: "Noruega", flag: "🇳🇴",
        stickers: ts("NOR", ["Norway Logo", "Ørjan Nyland", "Julian Ryerson", "Kristoffer Vassbakk Ajer", "David Møller Wolfe", "Martin Ødegaard", "Sander Berge", "Patrick Berg", "Erling Haaland", "Antonio Nusa", "Oscar Bobb", "Alexander Sørloth"]),
      },
    ],
  },
  {
    id: "CONCACAF",
    name: "🌎 CONCACAF - Norte y Centro América",
    teams: [
      {
        id: "USA", name: "Estados Unidos", flag: "🇺🇸",
        stickers: ts("USA", ["USA Logo", "Matt Freese", "Chris Richards", "Tim Ream", "Mark McKenzie", "Tyler Adams", "Weston McKennie", "Timothy Weah", "Malik Tillman", "Christian Pulisic", "Brenden Aaronson", "Folarin Balogun"]),
      },
      {
        id: "MEX", name: "México", flag: "🇲🇽",
        stickers: ts("MEX", ["Mexico Logo", "Luis Malagón", "Johan Vásquez", "César Montes", "Jesús Gallardo", "Israel Reyes", "Edson Álvarez", "Marcel Ruiz", "Hirving Lozano", "Raúl Jiménez", "Alexis Vega", "Roberto Alvarado"]),
      },
      {
        id: "CAN", name: "Canadá", flag: "🇨🇦",
        stickers: ts("CAN", ["Canada Logo", "Dayne St. Clair", "Alphonso Davies", "Richie Laryea", "Derek Cornelius", "Stephen Eustáquio", "Ismaël Koné", "Jacob Shaffelburg", "Niko Sigur", "Tajon Buchanan", "Cyle Larin", "Jonathan David"]),
      },
      {
        id: "HAI", name: "Haití", flag: "🇭🇹",
        stickers: ts("HAI", ["Haiti Logo", "Johny Placide", "Carlens Arcus", "Ricardo Adé", "Duke Lacroix", "Leverton Pierre", "Danley Jean Jacques", "Jean-Ricner Bellegarde", "Josué Casimir", "Ruben Providence", "Duckens Nazon", "Frantzdy Pierrot"]),
      },
      {
        id: "CUR", name: "Curazao", flag: "🇨🇼",
        stickers: ts("CUR", ["Curaçao Logo", "Eloy Room", "Armando Obispo", "Sherel Floranus", "Roshon van Eijma", "Shurandy Sambo", "Livano Comenencia", "Juninho Bacuna", "Leandro Bacuna", "Kenji Gorré", "Jürgen Locadia", "Sontje Hansen"]),
      },
      {
        id: "PAN", name: "Panamá", flag: "🇵🇦",
        stickers: ts("PAN", ["Panama Logo", "Orlando Mosquera", "Michael Amir Murillo", "Andrés Andrade", "Fidel Escobar", "Aníbal Godoy", "Cristian Martínez", "Adalberto Carrasquilla", "Édgar Bárcenas", "José Fajardo", "Ismael Díaz", "José Luis Rodríguez"]),
      },
    ],
  },
  {
    id: "CAF",
    name: "🌍 CAF - África",
    teams: [
      {
        id: "MAR", name: "Marruecos", flag: "🇲🇦",
        stickers: ts("MAR", ["Morocco Logo", "Yassine Bounou", "Achraf Hakimi", "Noussair Mazraoui", "Nayef Aguerd", "Romain Saïss", "Sofyan Amrabat", "Eliesse Ben Seghir", "Bilal El Khannouss", "Ismael Saibari", "Youssef En-Nesyri", "Brahim Díaz"]),
      },
      {
        id: "SEN", name: "Senegal", flag: "🇸🇳",
        stickers: ts("SEN", ["Senegal Logo", "Édouard Mendy", "Kalidou Koulibaly", "Moussa Niakhaté", "El Hadji Malick Diouf", "Idrissa Gana Gueye", "Pape Matar Sarr", "Sadio Mané", "Iliman Ndiaye", "Krépin Diatta", "Ismaïla Sarr", "Nicolas Jackson"]),
      },
      {
        id: "GHA", name: "Ghana", flag: "🇬🇭",
        stickers: ts("GHA", ["Ghana Logo", "Lawrence Ati Zigi", "Alidu Seidu", "Alexander Djiku", "Gideon Mensah", "Caleb Yirenkyi", "Thomas Partey", "Abdul Issahaku Fatawu", "Mohammed Kudus", "Kamaldeen Sulemana", "Jordan Ayew", "Antoine Semenyo"]),
      },
      {
        id: "EGY", name: "Egipto", flag: "🇪🇬",
        stickers: ts("EGY", ["Egypt Logo", "Mohamed Elshenawy", "Mohamed Hany", "Yasser Ibrahim", "Ramy Rabia", "Marwan Attia", "Zizo", "Hamdy Fathy", "Omar Marmoush", "Mohamed Salah", "Mostafa Mohamed", "Trezeguet"]),
      },
      {
        id: "CIV", name: "Costa de Marfil", flag: "🇨🇮",
        stickers: ts("CIV", ["Côte d'Ivoire Logo", "Yahia Fofana", "Ghislain Konan", "Wilfried Singo", "Evan Ndicka", "Willy Boly", "Franck Kessié", "Seko Fofana", "Ibrahim Sangaré", "Sébastien Haller", "Simon Adingra", "Evann Guessand"]),
      },
      {
        id: "TUN", name: "Túnez", flag: "🇹🇳",
        stickers: ts("TUN", ["Tunisia Logo", "Aymen Dahmen", "Montassar Talbi", "Yassine Meriah", "Ali Abdi", "Ferjani Sassi", "Ellyes Skhiri", "Aïssa Laídouni", "Hannibal Mejbri", "Naïm Sliti", "Elias Achouri", "Hazem Mastouri"]),
      },
      {
        id: "RSA", name: "Sudáfrica", flag: "🇿🇦",
        stickers: ts("RSA", ["South Africa Logo", "Ronwen Williams", "Aubrey Modiba", "Mbekezeli Mbokazi", "Siyabonga Ngezana", "Khuliso Mudau", "Teboho Mokoena", "Yaya Sithole", "Bathusi Aubaas", "Sipho Mbule", "Lyle Foster", "Oswin Appollis"]),
      },
      {
        id: "ALG", name: "Argelia", flag: "🇩🇿",
        stickers: ts("ALG", ["Algeria Logo", "Alexis Guendouz", "Rayan Aït-Nouri", "Ramy Bensebaini", "Youcef Atal", "Aïssa Mandi", "Nabil Bentaleb", "Riyad Mahrez", "Saïd Benrahma", "Amine Gouiri", "Mohamed Amoura", "Baghdad Bounedjah"]),
      },
      {
        id: "CPV", name: "Cabo Verde", flag: "🇨🇻",
        stickers: ts("CPV", ["Cabo Verde Logo", "Vozinha", "Logan Costa", "Pico", "Steven Moreira", "João Paulo", "Kevin Pina", "Jamiro Monteiro", "Yannick Semedo", "Ryan Mendes", "Jovane Cabral", "Dailon Livramento"]),
      },
      {
        id: "COD", name: "Rep. D. del Congo", flag: "🇨🇩",
        stickers: ts("COD", ["Congo DR Logo", "Lionel Mpasi", "Aaron Wan-Bissaka", "Axel Tuanzebe", "Arthur Masuaku", "Chancel Mbemba", "Ngal'ayel Mukau", "Samuel Moutoussamy", "Noah Sadiki", "Théo Bongonda", "Yoane Wissa", "Cédric Bakambu"]),
      },
    ],
  },
  {
    id: "AFC",
    name: "🌏 AFC - Asia",
    teams: [
      {
        id: "JPN", name: "Japón", flag: "🇯🇵",
        stickers: ts("JPN", ["Japan Logo", "Zion Suzuki", "Tsuyoshi Watanabe", "Kaishu Sano", "Ao Tanaka", "Daichi Kamada", "Ritsu Doan", "Keito Nakamura", "Takumi Minamino", "Takefusa Kubo", "Shuto Machino", "Ayase Ueda"]),
      },
      {
        id: "KOR", name: "Corea del Sur", flag: "🇰🇷",
        stickers: ts("KOR", ["Korea Republic Logo", "Hyeonwoo Jo", "Minjae Kim", "Yumin Cho", "Youngwoo Seol", "Jaesung Lee", "Inbeom Hwang", "Kangin Lee", "Jens Castrop", "Heungmin Son", "Heechan Hwang", "Hyeongyu Oh"]),
      },
      {
        id: "KSA", name: "Arabia Saudita", flag: "🇸🇦",
        stickers: ts("KSA", ["Saudi Arabia Logo", "Nawaf Alaqidi", "Hassan Altambakti", "Jehad Thikri", "Saud Abdulhamid", "Nasser Aldawsari", "Abdullah Alkhaibari", "Musab Aljuwayr", "Feras Albrikan", "Salem Aldawsari", "Saleh Abu Alshamat", "Saleh Alshehri"]),
      },
      {
        id: "IRN", name: "Irán", flag: "🇮🇷",
        stickers: ts("IRN", ["IR Iran Logo", "Alireza Beiranvand", "Shojae Khalilzadeh", "Milad Mohammadi", "Ramin Rezaeian", "Hossein Kanaani", "Saeed Ezatolahi", "Saman Ghoddos", "Mohammad Mohebi", "Mehdi Taremi", "Sardar Azmoun", "Alireza Jahanbakhsh"]),
      },
      {
        id: "AUS", name: "Australia", flag: "🇦🇺",
        stickers: ts("AUS", ["Australia Logo", "Mathew Ryan", "Harry Souttar", "Aziz Behich", "Cameron Burgess", "Lewis Miller", "Jackson Irvine", "Riley McGree", "Aiden O'Neill", "Connor Metcalfe", "Kusini Yengi", "Nestory Irankunda"]),
      },
      {
        id: "QAT", name: "Qatar", flag: "🇶🇦",
        stickers: ts("QAT", ["Qatar Logo", "Meshaal Barsham", "Sultan Albrake", "Boualem Khoukhi", "Pedro Miguel", "Mohammed Mannai", "Karim Boudiaf", "Assim Madibo", "Edmílson Junior", "Akram Hassan Afif", "Ahmed Al-Ganehi", "Almoez Ali"]),
      },
      {
        id: "IRQ", name: "Irak", flag: "🇮🇶",
        stickers: ts("IRQ", ["Iraq Logo", "Jalal Hassan", "Hussein Ali", "Akam Hashem", "Merchas Doski", "Zaid Tahseen", "Zidane Iqbal", "Amir Al-Ammari", "Ibrahim Bayesh", "Ali Jasim", "Aimar Sher", "Mohanad Ali"]),
      },
      {
        id: "JOR", name: "Jordania", flag: "🇯🇴",
        stickers: ts("JOR", ["Jordan Logo", "Yazeed Abulaila", "Mohammad Abu Hashish", "Yazan Al-Arab", "Abdallah Nasib", "Ibrahim Saadeh", "Nizar Al-Rashdan", "Noor Al-Rawabdeh", "Yazan Al-Naimat", "Mousa Al-Taamari", "Mahmoud Al-Mardi", "Ali Olwan"]),
      },
      {
        id: "UZB", name: "Uzbekistán", flag: "🇺🇿",
        stickers: ts("UZB", ["Uzbekistan Logo", "Utkir Yusupov", "Abdukodir Khusanov", "Farrukh Sayfiev", "Sherzod Nasrullaev", "Husniddin Aliqulov", "Rustam Ashurmatov", "Khojiakbar Alijonov", "Odiljon Hamrobekov", "Otabek Shukurov", "Eldor Shomurodov", "Abbosbek Fayzullaev"]),
      },
    ],
  },
  {
    id: "OFC",
    name: "🌏 OFC - Oceanía",
    teams: [
      {
        id: "NZL", name: "Nueva Zelanda", flag: "🇳🇿",
        stickers: ts("NZL", ["New Zealand Logo", "Max Crocombe", "Michael Boxall", "Liberato Cacace", "Tim Payne", "Finn Surman", "Marko Stamenić", "Joe Bell", "Sarpreet Singh", "Matthew Garbett", "Chris Wood", "Elijah Just"]),
      },
    ],
  },
];


export const ALL_STICKERS = new Map<
  string,
  { def: StickerDef; team: TeamDef; confederation: ConfederationDef }
>();

for (const conf of CONFEDERATIONS) {
  for (const team of conf.teams) {
    for (const sticker of team.stickers) {
      ALL_STICKERS.set(sticker.id, { def: sticker, team, confederation: conf });
    }
  }
}

export const TOTAL_STICKERS = ALL_STICKERS.size;

export function getStickerById(id: string) {
  return ALL_STICKERS.get(id);
}

export const ALL_TEAMS = new Map<string, TeamDef>();
for (const conf of CONFEDERATIONS) {
  for (const team of conf.teams) {
    ALL_TEAMS.set(team.id, team);
  }
}

export interface GroupDef {
  id: string;
  name: string;
  teamIds: string[];
}

export const GROUPS: GroupDef[] = [
  { id: "A", name: "Grupo A", teamIds: ["MEX", "RSA", "KOR", "CZE"] },
  { id: "B", name: "Grupo B", teamIds: ["CAN", "BIH", "QAT", "SUI"] },
  { id: "C", name: "Grupo C", teamIds: ["BRA", "MAR", "HAI", "SCO"] },
  { id: "D", name: "Grupo D", teamIds: ["USA", "PAR", "AUS", "TUR"] },
  { id: "E", name: "Grupo E", teamIds: ["GER", "CUR", "CIV", "ECU"] },
  { id: "F", name: "Grupo F", teamIds: ["NED", "JPN", "SWE", "TUN"] },
  { id: "G", name: "Grupo G", teamIds: ["BEL", "EGY", "IRN", "NZL"] },
  { id: "H", name: "Grupo H", teamIds: ["ESP", "CPV", "KSA", "URU"] },
  { id: "I", name: "Grupo I", teamIds: ["FRA", "SEN", "IRQ", "NOR"] },
  { id: "J", name: "Grupo J", teamIds: ["ARG", "ALG", "AUT", "JOR"] },
  { id: "K", name: "Grupo K", teamIds: ["POR", "COD", "UZB", "COL"] },
  { id: "L", name: "Grupo L", teamIds: ["ENG", "CRO", "GHA", "PAN"] },
];
