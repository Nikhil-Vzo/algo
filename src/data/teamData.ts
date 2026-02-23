export interface TeamMember {
    id: number;
    name: string;
    role?: string;
    lead?: boolean;
    image?: string;
}

export interface TeamCategory {
    id: string;
    name: string;
    members: TeamMember[];
}

const teamCategories: TeamCategory[] = [
    {
        id: 'leadership',
        name: 'Leadership',
        members: [
            { id: 0, name: 'Vinay Ku. Singh', role: 'DY. Director', image: 'https://i.ibb.co/9LHPV8M/vinay.jpg' },
            { id: -1, name: 'Kranti Ku. Dewangan', role: 'HOD', image: 'https://i.ibb.co/1ttL40tN/kranti.jpg' },
            { id: -2, name: 'Pawan Kumar', role: 'Faculty Co-ordinator', image: 'https://i.ibb.co/GQ5bDgjL/pawan.jpg' },
        ],
    },
    {
        id: 'overall',
        name: 'Overall',
        members: [
            { id: 1, name: 'Nitin Kumar Singh', image: 'https://i.ibb.co/G3N1WkmM/nitin.webp' },
            { id: 2, name: 'Biswajit Nayak', image: 'https://i.ibb.co/ds7SL7w8/biswajit.jpg' },
        ],
    },
    {
        id: 'technical',
        name: 'Technical',
        members: [
            { id: 3, name: 'Nikhil Yadav', image: 'https://i.ibb.co/N6zN3HML/nik-1.jpg' },
        ],
    },
    {
        id: 'design',
        name: 'Design',
        members: [
            { id: 4, name: 'Aditya Chourasia', lead: true, image: 'https://i.ibb.co/VcJxRMY5/aditya.jpg' },
            { id: 5, name: 'Ashutosh Sahu', image: 'https://i.ibb.co/8LKhhz9f/ashutosh.webp' },
            { id: 6, name: 'Atharav Pratap Singh', image: 'https://i.ibb.co/tTbqbnjt/athrav.webp' },
            { id: 7, name: 'Rupendra Kumar Sahu', image: 'https://i.ibb.co/gM28D0QT/rupendra.jpg' },
        ],
    },
    {
        id: 'social-media',
        name: 'Social Media',
        members: [
            { id: 8, name: 'Gourav Kumar Behera', lead: true, image: 'https://i.ibb.co/KcQbJGFm/gourav.jpg' },
            { id: 9, name: 'Tushar Shendey', image: 'https://i.ibb.co/YFhmKWyS/tushar.webp' },
            { id: 10, name: 'Shreya Barde', image: 'https://i.ibb.co/xSv1W4wb/shreya.webp' },
            { id: 11, name: 'Jiya Dhand', image: 'https://i.ibb.co/JjP46w9x/jiya.jpg' },
            { id: 12, name: 'Komal Meghani', image: 'https://i.ibb.co/Vcf6YSvk/komal.jpg' },
        ],
    },
    {
        id: 'financial-sponsorship',
        name: 'Financial & Sponsorship',
        members: [
            { id: 13, name: 'Manisha Biswal', image: 'https://i.ibb.co/x83zN0Yp/manisha.webp' },
            { id: 14, name: 'Naman Kumar', image: 'https://i.ibb.co/C5h6j04q/naman.jpg' },
            { id: 15, name: 'Anshu', image: 'https://i.ibb.co/1htHgWY/anshu.jpg' },
        ],
    },
    {
        id: 'logistics-hospitality',
        name: 'Logistics & Hospitality',
        members: [
            { id: 16, name: 'Yuti Sasane', lead: true, image: 'https://i.ibb.co/KxGKmQC6/yuti.jpg' },
            { id: 17, name: 'Ujjawal Singh', image: 'https://i.ibb.co/cht2bcnx/ujjawal.jpg' },
            { id: 18, name: 'Shruti Kumari', image: 'https://i.ibb.co/pjWBWNz8/shruti.jpg' },
            { id: 19, name: 'Kartik Shreekumar', image: 'https://i.ibb.co/prKT7pLB/kartik.webp' },
            { id: 20, name: 'Yogesh Sunil Wathe', image: 'https://i.ibb.co/nsZ0y4C6/yogesh.webp' },
        ],
    },
    {
        id: 'registration',
        name: 'Registration Committee',
        members: [
            { id: 21, name: 'Sakshi Bhatt', image: 'https://i.ibb.co/d4PJy9kS/sakshi.webp' },
            { id: 22, name: 'Anushka Choudhary', image: 'https://i.ibb.co/kgRntqSs/anushka.jpg' },
            { id: 23, name: 'Swati Agrawal', image: 'https://i.ibb.co/wr4sW6wJ/swati.jpg' },
            { id: 24, name: 'Nibedita Patel', image: 'https://i.ibb.co/Y7XJ6hh5/nibedita.webp' },
        ],
    },
    {
        id: 'volunteering-support',
        name: 'Volunteering & Support',
        members: [
            { id: 25, name: 'Shraddha Sahu', lead: true, image: 'https://i.ibb.co/QjJrZ1mW/shraddha.jpg' },
            { id: 26, name: 'Yash Bhikhwani', image: 'https://i.ibb.co/pBtqVx89/yash.jpg' },
        ],
    },
];

export default teamCategories;
