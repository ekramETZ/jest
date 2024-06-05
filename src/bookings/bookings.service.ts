import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookings } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import * as nodemailer from 'nodemailer';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as fs from 'fs';
import * as hbs from 'handlebars';
import * as puppeteer from 'puppeteer';
import { Agents } from '../agents/entities/agent.entity';
import { Ticketed } from '../ticketed/entities/ticketed.entity';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Bookings)
    private BookingRepository: Repository<Bookings>,
    @InjectRepository(Agents)
    private AgentRepository: Repository<Agents>,
    @InjectRepository(Ticketed)
    private TicketedRepository: Repository<Ticketed>,
  ) {}

  findAll(): Promise<Bookings[]> {
    return this.BookingRepository.find();
  }

  async findOne(id: number): Promise<Bookings> {
    const booking = await this.BookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`booking with ID ${id} not found`);
    }
    return booking;
  }

  create(CreateBookingDto: CreateBookingDto): Promise<Bookings> {
    const agent = this.BookingRepository.create(CreateBookingDto);
    return this.BookingRepository.save(agent );
  }

  async update(id: number, UpdateBookingDto: UpdateBookingDto): Promise<void> {
    const result = await this.BookingRepository.update(id, UpdateBookingDto);
    if (result.affected === 0) {
      throw new NotFoundException(`booking with ID ${id} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.BookingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`booking with ID ${id} not found`);
    }
  }





 async generateTicket(bookingId: string): Promise<void> {
  const booking = await this.BookingRepository.findOneBy({ bookingId: bookingId });
  
  if (!booking) {
    throw new NotFoundException(`Booking with ID ${bookingId} not found`);
  }
  
  let agent;
  const agentId:string = booking.agentId;
  const rawagent = await this.AgentRepository.findOneBy({ agentId: agentId });
  
  if (!rawagent) {
    throw new NotFoundException(`Agent with ID ${agentId} not found`);
  }
  if (rawagent) {
    const { password, ...rest } = rawagent;
    agent = rest;
  }

  //const ticketId:string = booking.agentId;
  const ticket = await this.TicketedRepository.findOneBy({ bookingId: bookingId });
  //console.log(ticket)
  if (!ticket) {
    throw new NotFoundException(`Agent with ID ${agentId} not found`);
  }
  const ticketnumber = ticket.ticketnumber 
  

  const flightDataArray = JSON.parse(booking.flightdata);
  //console.log(flightDataArray);
  // Access the arrivalTerminalName
  const arrivalTerminalName = flightDataArray[0]?.arrivalTerminalName;
  const departureTerminalName = flightDataArray[0]?.departureTerminalName;
  //console.log(arrivalTerminalName, departureTerminalName); // Output: "TERMINAL 3"
  const Comission = booking.comission * (-1);
  const discount = Comission/100 * (booking.itenary.BaseFare);
  const Duration = convertMinutesToHoursAndMinutes(booking.itenary.AllLegsInfo[0].Segments[0].Duration); // Output: "5 hour(s) and 0 minute(s)"
  const vat = (booking.itenary.GrossFare * 0.003).toFixed(2);
  const type = booking.itenary.PriceBreakDown?.[0]?.PaxType === "ADT" ? 'Adult' : 'Child';  // CNN for Child
  const totalpassenger = booking.itenary.PriceBreakDown.length;
  const arrsize = booking.itenary.AllLegsInfo;
  const stop = booking.itenary.AllLegsInfo.length == 1 ? 'Non Stop' : `${booking.itenary.AllLegsInfo.length} Stop`
  //console.log(arrsize);
  
  
  
  // convert date ---------------------------------------------------------------------------------------------------------------------
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();

    // Function to get the ordinal suffix for a number
    function getOrdinalSuffix(n) {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    const dayWithSuffix = day + getOrdinalSuffix(day);

    return `${dayWithSuffix} ${month} ${year}`;
}

// Example usage:

const formattedDate = formatDate(booking.flightdate);



  // minit to hour convert----------------------------------------------------------------------------------------------------------------------------------
  function convertMinutesToHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}H ${minutes}Min`;
  }

  // map part start here to do summaation of totalammount----------------------------------------------------------------------------------------
  const totalAmount  = booking.itenary.PriceBreakDown.map(item => item.TotalFare);
  const totalFareSum = totalAmount.reduce((acc, cur) => acc + cur, 0);

  // number to text converter--------------------------------------------------------------------------------------------------------------------------
  function numberToWords(num) {
    if (num === 0) return "zero";

    const lessThan20 = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "thousand", "million", "billion"];

    function helper(num) {
      if (num === 0) {
          return "";
      } else if (num < 20) {
          return lessThan20[num] + " ";
      } else if (num < 100) {
          return tens[Math.floor(num / 10)] + " " + helper(num % 10);
      } else {
          return lessThan20[Math.floor(num / 100)] + " hundred " + helper(num % 100);
      }
  }

    let word = "";
    let i = 0;

    while (num > 0) {
        if (num % 1000 !== 0) {
          word = helper(num % 1000) + thousands[i] + " " + word;
        }
        num = Math.floor(num / 1000);
        i++;
    }

    word = word.trim();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // Example usage:

  const textTk = numberToWords(totalFareSum); // Output: "one million two hundred thirty-four thousand five hundred sixty-seven"
  //console.log(textTk);

  //console.log(booking.totalpax);
  // Combine booking and agent data
  let data = { ...booking, 
      agent, 
      bag :  booking.itenary.PriceBreakDown?.[0]?.Bag?.[0]?.Allowance,
      ArrAirPort : booking.itenary.AllLegsInfo[0].Segments[0].ArrAirPort,
      DepAirPort : booking.itenary.AllLegsInfo[0].Segments[0].DepAirPort,
      Duration,
      PaxType : type ,
      PaxCount : booking.itenary.PriceBreakDown?.[0]?.PaxCount,
      TotalFare : booking.itenary.PriceBreakDown?.[0]?.TotalFare,
      vat,
      totalFareSum,
      textTk,
      discount,
      formattedDate,
      departureTerminalName,
      arrivalTerminalName,
      ticketnumber,
      stop,
      imgg : booking.itenary.Carrier.toLowerCase(),
      arrsize,
      totalpax : booking.totalpax,
      totalpassenger
  
  
  
  };
  //
  
console.log(data);




// have to work here---------------------------------------------------------------------------------------------------------------------------------------------

  // Generate HTML from Handlebars template------------------------------------------------------------------
  const template = fs.readFileSync('./templates/ticket.hbs', 'utf8');
  const compiledTemplate = hbs.compile(template);
  const html = compiledTemplate(data);

  // Generate PDF from HTML using Puppeteer
  let pdfBuffer: Buffer;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 60000, // Increase the timeout to 60 seconds
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
      printBackground: true,
    });
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }

  // Send email with PDF attachment
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'mohammadtohidul.alam@etripzone.com', // your Zoho email address
      pass: 'missionLEARN10', // your Zoho email password
    },
  });

  const mailOptions = {
    from: 'mohammadtohidul.alam@etripzone.com',
    to: booking.email,
    subject: 'Your Ticket',
    text: 'Please find your ticket attached.',
    attachments: [
      {
        filename: 'ticket.pdf',
        content: pdfBuffer,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

  







}
