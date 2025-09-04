import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(_request) {
  try {
    console.log('🔍 Contact API - Version simple (sans Google)');
    
    const contactData = await request.json();
    console.log('📧 Données contact:', contactData);
    
    // Validation
    if (!contactData.name || !contactData.email || !contactData.message) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.log('❌ RESEND_API_KEY manquante');
      return NextResponse.json({ error: 'Configuration email manquante' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('📤 Envoi email de confirmation...');
    
    // Email de confirmation au client
    await resend.emails.send({
      from: 'contact@rh-prospects.fr',
      to: contactData.email,
      subject: 'Message bien reçu - S.M.Consulting',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Message bien reçu !</h2>
          <p>Bonjour ${contactData.name},</p>
          <p>Nous avons bien reçu votre message :</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            ${contactData.message}
          </div>
          <p>Notre équipe vous recontactera dans les <strong>24 heures</strong> qui suivent.</p>
          <p>Cordialement,<br>L'équipe S.M.Consulting</p>
        </div>
      `
    });

    console.log('📤 Envoi notification interne...');
    
    // Email interne
    await resend.emails.send({
      from: 'system@rh-prospects.fr',
      to: 'contact@rh-prospects.fr',
      subject: `[CONTACT SITE] ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Nouveau contact depuis le site</h2>
          <p><strong>Type :</strong> ${contactData.type || 'Contact général'}</p>
          <p><strong>Nom :</strong> ${contactData.name}</p>
          <p><strong>Email :</strong> ${contactData.email}</p>
          <p><strong>Entreprise :</strong> ${contactData.company || 'Non renseignée'}</p>
          <hr>
          <p><strong>Message :</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${contactData.message}
          </div>
          <hr>
          <p><strong>Répondre à :</strong> ${contactData.email}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `
    });

    console.log('✅ Emails envoyés avec succès');
    return NextResponse.json({ 
      success: true, 
      message: 'Message envoyé avec succès' 
    });

  } catch (_error) {
    console.error('❌ Erreur envoi contact:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'envoi',
      details: error.message 
    }, { status: 500 });
  }
}