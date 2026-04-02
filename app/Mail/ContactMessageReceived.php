<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New contact: '.($this->contactMessage->subject ?? 'Portfolio inquiry'),
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.contact',
            with: [
                'messageModel' => $this->contactMessage,
            ],
        );
    }
}
