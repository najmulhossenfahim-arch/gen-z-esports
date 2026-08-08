import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Linking } from 'react-native';

export default function App() {
  const [appTitle, setAppTitle] = useState("Gen Z Esports");
  const [bkashNumber, setBkashNumber] = useState("01816205692");
  const [nagadNumber, setNagadNumber] = useState("01816205692");
  const [adminPassword, setAdminPassword] = useState("1234");
  
  // WhatsApp Group Link (এখান থেকে পরিবর্তন করতে পারবেন)
  const [whatsappLink, setWhatsappLink] = useState("https://chat.whatsapp.com/ExampleGroupLink123");

  const [activeTab, setActiveTab] = useState('matches');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // টুর্নামেন্ট লিস্ট
  const [matches, setMatches] = useState([
    { 
      id: '1', 
      title: 'Free Fire Squad Battle #101', 
      fee: '50 Tk', 
      prize: '500 Tk', 
      time: '8:00 PM', 
      rules: '১. হ্যাকিং সম্পূর্ণ নিষিদ্ধ। ধরা পড়লে আজীবন ব্যান।\n২. হোয়াটসঅ্যাপ গ্রুপে নির্ধারিত সময়ের ১০ মিনিট আগে মেসেজ দেওয়া হবে।'
    },
    { 
      id: '2', 
      title: 'Free Fire Solo Clash #102', 
      fee: '20 Tk', 
      prize: '200 Tk', 
      time: '9:30 PM', 
      rules: '১. সোলো ম্যাচে টিম-আপ করা নিষেধ।\n২. এমুলেটর প্লেয়ার এলাউড না।'
    }
  ]);

  // বুকিং ডাটাবেজ
  const [bookings, setBookings] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [viewGroupMatch, setViewGroupMatch] = useState(null);

  // Form States
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerUid, setPlayerUid] = useState('');
  const [trxId, setTrxId] = useState('');

  // Admin Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newFee, setNewFee] = useState('');
  const [newPrize, setNewPrize] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newRules, setNewRules] = useState('');

  const handleLogin = () => {
    if (passInput === adminPassword) {
      setIsAdmin(true);
      setShowAuthModal(false);
      setPassInput('');
      setActiveTab('admin');
    } else {
      Alert.alert("Error", "ভুল পাসওয়ার্ড!");
    }
  };

  // স্লট বুকিং
  const handleConfirmBooking = () => {
    if (!teamName || !playerName || !playerUid || !trxId) {
      Alert.alert("Error", "সবগুলো তথ্য সঠিকভাবে পূরণ করুন!");
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      matchId: selectedMatch.id,
      matchTitle: selectedMatch.title,
      team: teamName,
      player: playerName,
      uid: playerUid,
      trx: trxId,
      status: 'pending' // পেন্ডিং থাকবে
    };

    setBookings([...bookings, newBooking]);
    Alert.alert("সফল হয়েছে!", "আপনার পেমেন্ট তথ্য জমা নেওয়া হয়েছে। অ্যাডমিন ভেরিফাই করলেই WhatsApp গ্রুপ লিংক আনলক হয়ে যাবে।");
    setSelectedMatch(null);
    setTeamName(''); setPlayerName(''); setPlayerUid(''); setTrxId('');
  };

  // পেমেন্ট অ্যাপ্রুভ (WhatsApp Link Unlock)
  const handleApproveBooking = (bookingId) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'approved' } : b));
    Alert.alert("Approved!", "এই প্লেয়ারের জন্য WhatsApp গ্রুপ লিংক আনলক করা হয়েছে।");
  };

  // নতুন ম্যাচ
  const handleAddMatch = () => {
    if (!newTitle || !newFee || !newPrize) {
      Alert.alert("Error", "ম্যাচ টাইটেল, এন্ট্রি ফি ও প্রাইজ প্রদান করুন!");
      return;
    }
    const item = {
      id: Date.now().toString(),
      title: newTitle,
      fee: newFee,
      prize: newPrize,
      time: newTime || 'TBA',
      rules: newRules || '১. ফেয়ার প্লে বজায় রাখুন।'
    };
    setMatches([...matches, item]);
    setNewTitle(''); setNewFee(''); setNewPrize(''); setNewTime(''); setNewRules('');
    Alert.alert("Success", "নতুন ম্যাচ যুক্ত করা হয়েছে!");
  };

  // পেমেন্ট ভেরিফাইড কিনা
  const checkUserVerified = (matchId) => {
    return bookings.some(b => b.matchId === matchId && b.status === 'approved');
  };

  // WhatsApp জয়েন করার ফাংশন
  const openWhatsAppGroup = () => {
    Linking.openURL(whatsappLink).catch(() => {
      Alert.alert("Error", "WhatsApp ওপেন করা যাচ্ছে না। আপনার ফোনে কি WhatsApp ইনস্টল করা আছে?");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>{appTitle}</Text>
      </View>

      <ScrollView style={styles.content}>
        
        {/* MATCHES LIST */}
        {activeTab === 'matches' && (
          <View>
            <Text style={styles.sectionTitle}>🔥 Active Matches</Text>
            {matches.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.matchTitle}>{item.title}</Text>
                <Text style={styles.detailText}>ফি: {item.fee} | প্রাইজ: {item.prize} | সময়: {item.time}</Text>
                
                <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                  <TouchableOpacity style={styles.btnPrimary} onPress={() => setSelectedMatch(item)}>
                    <Text style={styles.btnText}>Join / Book Slot</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.btnSecondary} onPress={() => setViewGroupMatch(item)}>
                    <Text style={{color:'#fff', fontWeight:'bold', fontSize: 12}}>💬 WhatsApp Group</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ADMIN CONTROL PANEL */}
        {activeTab === 'admin' && isAdmin && (
          <View>
            <Text style={styles.sectionTitle}>⚙️ Admin Control Panel</Text>

            {/* 1. WhatsApp Group Link Setup */}
            <View style={styles.adminBox}>
              <Text style={styles.boxTitle}>🔗 WhatsApp গ্রুপের লিংক সেটআপ করুন</Text>
              <TextInput style={styles.input} placeholder="WhatsApp Group Link (e.g. https://chat.whatsapp.com/...)" value={whatsappLink} onChangeText={setWhatsappLink} />
              <Text style={{color:'#aaa', fontSize: 11}}>প্লেয়ারদের টাকা ভেরিফাই করলে তারা অটোমেটিক এই লিংকে যুক্ত হতে পারবে।</Text>
            </View>

            {/* 2. Slot Verification */}
            <View style={[styles.adminBox, { marginTop: 15 }]}>
              <Text style={styles.boxTitle}>📋 স্লট বুকিং ও পেমেন্ট ভেরিফিকেশন</Text>
              {bookings.length === 0 ? <Text style={{color:'#888'}}>এখনো কোনো বুকিং জমা পড়েনি</Text> : null}
              {bookings.map(b => (
                <View key={b.id} style={styles.bookingCard}>
                  <Text style={styles.bookingText}>ম্যাচ: {b.matchTitle}</Text>
                  <Text style={styles.bookingText}>টিম: {b.team} | প্লেয়ার: {b.player}</Text>
                  <Text style={styles.bookingText}>UID: {b.uid}</Text>
                  <Text style={{color:'#00FF66'}}>TrxID: {b.trx}</Text>
                  <Text style={{color: b.status === 'approved' ? '#00FF66' : '#f59e0b', marginTop: 4}}>
                    Status: {b.status === 'approved' ? 'VERIFIED (LINK UNLOCKED)' : 'PENDING (LOCKED)'}
                  </Text>

                  {b.status === 'pending' && (
                    <TouchableOpacity style={styles.btnApprove} onPress={() => handleApproveBooking(b.id)}>
                      <Text style={{color:'#000', fontWeight:'bold', fontSize: 12}}>✅ Approve Payment (Unlock WA Link)</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* 3. Add New Match */}
            <View style={[styles.adminBox, { marginTop: 15 }]}>
              <Text style={styles.boxTitle}>➕ নতুন ম্যাচ যোগ করুন</Text>
              <TextInput style={styles.input} placeholder="Match Title" value={newTitle} onChangeText={setNewTitle} />
              <TextInput style={styles.input} placeholder="Fee (e.g. 50 Tk)" value={newFee} onChangeText={setNewFee} />
              <TextInput style={styles.input} placeholder="Prize (e.g. 500 Tk)" value={newPrize} onChangeText={setNewPrize} />
              <TextInput style={styles.input} placeholder="Time (e.g. 8:00 PM)" value={newTime} onChangeText={setNewTime} />
              <TextInput style={styles.input} placeholder="রুলস ও নিয়মাবলী" value={newRules} onChangeText={setNewRules} multiline />
              <TouchableOpacity style={styles.btnPrimary} onPress={handleAddMatch}>
                <Text style={styles.btnText}>+ Add Match</Text>
              </TouchableOpacity>
            </View>

            {/* 4. Settings */}
            <View style={[styles.adminBox, { marginTop: 15 }]}>
              <Text style={styles.boxTitle}>⚙️ সেটিংস কাস্টমাইজেশন</Text>
              <TextInput style={styles.input} placeholder="Bkash Number" value={bkashNumber} onChangeText={setBkashNumber} />
              <TextInput style={styles.input} placeholder="Nagad Number" value={nagadNumber} onChangeText={setNagadNumber} />
              <TextInput style={styles.input} placeholder="Change Admin Password" value={adminPassword} onChangeText={setAdminPassword} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('matches')}><Text style={styles.navText}>🎮 Matches</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => !isAdmin ? setShowAuthModal(true) : setActiveTab('admin')}><Text style={styles.navText}>🔒 Admin Panel</Text></TouchableOpacity>
      </View>

      {/* View WhatsApp Link Modal */}
      <Modal visible={!!viewGroupMatch} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💬 {viewGroupMatch?.title}</Text>
            
            {checkUserVerified(viewGroupMatch?.id) ? (
              <View style={styles.roomBox}>
                <Text style={{color:'#00FF66', fontWeight:'bold', marginBottom: 8}}>✅ পেমেন্ট ভেরিফাইড!</Text>
                <Text style={{color:'#ccc', fontSize: 13, marginBottom: 12}}>নিচের বাটনে ক্লিক করে টুর্নামেন্টের প্রাইভেট WhatsApp গ্রুপে জয়েন করুন। সেখানে রুম আইডি দেওয়া হবে।</Text>
                <TouchableOpacity style={styles.btnWhatsapp} onPress={openWhatsAppGroup}>
                  <Text style={{color:'#fff', fontWeight:'bold'}}>📲 Join WhatsApp Group</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.lockedBox}>
                <Text style={{color:'#ef4444', fontWeight:'bold', fontSize: 16, marginBottom: 5}}>🔒 Group Link Locked!</Text>
                <Text style={{color:'#cbd5e1', fontSize: 13, textAlign:'center'}}>
                  WhatsApp গ্রুপের লিংক পেতে প্রথমে পেমেন্ট সম্পন্ন করে স্লট বুক করুন। অ্যাডমিন আপনার পেমেন্ট ভেরিফাই করলেই লিংক আনলক হয়ে যাবে।
                </Text>
              </View>
            )}

            <View style={{marginTop: 15}}>
              <Text style={{color:'#00FF66', fontWeight:'bold', marginBottom:5}}>📜 ম্যাচের নিয়মাবলি:</Text>
              <Text style={{color:'#ccc', fontSize: 13, lineHeight: 18}}>{viewGroupMatch?.rules}</Text>
            </View>

            <TouchableOpacity style={[styles.btnPrimary, {marginTop: 15, width:'100%'}]} onPress={() => setViewGroupMatch(null)}>
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Slot Booking Form Modal */}
      <Modal visible={!!selectedMatch} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Slot Booking - {selectedMatch?.title}</Text>
            <Text style={{color:'#00FF66', marginBottom:8, fontWeight:'bold'}}>বিকাশ (Send Money): {bkashNumber} | নগদ: {nagadNumber}</Text>
            <TextInput style={styles.input} placeholder="Team Name" value={teamName} onChangeText={setTeamName} />
            <TextInput style={styles.input} placeholder="Player Name" value={playerName} onChangeText={setPlayerName} />
            <TextInput style={styles.input} placeholder="Free Fire UID" value={playerUid} onChangeText={setPlayerUid} />
            <TextInput style={styles.input} placeholder="Transaction ID (TrxID)" value={trxId} onChangeText={setTrxId} />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleConfirmBooking}><Text style={styles.btnText}>Submit & Pay</Text></TouchableOpacity>
            <TouchableOpacity style={{marginTop:10, alignItems:'center'}} onPress={() => setSelectedMatch(null)}><Text style={{color:'#888'}}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Admin Auth Modal */}
      <Modal visible={showAuthModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>অ্যাডমিন পাসওয়ার্ড দিন (Default: 1234)</Text>
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={passInput} onChangeText={setPassInput} />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}><Text style={styles.btnText}>Login</Text></TouchableOpacity>
            <TouchableOpacity style={{marginTop:10, alignItems:'center'}} onPress={() => setShowAuthModal(false)}><Text style={{color:'#888'}}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingTop: 40 },
  header: { alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderColor: '#1e293b' },
  logoText: { color: '#00FF66', fontSize: 22, fontWeight: 'bold' },
  content: { flex: 1, padding: 15 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, marginBottom: 15, borderLeftWidth: 4, borderColor: '#00FF66' },
  matchTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  detailText: { color: '#94a3b8', marginVertical: 3 },
  btnPrimary: { backgroundColor: '#00FF66', padding: 10, borderRadius: 6, alignItems: 'center', flex: 0.48 },
  btnSecondary: { backgroundColor: '#25D366', padding: 10, borderRadius: 6, alignItems: 'center', flex: 0.48 },
  btnWhatsapp: { backgroundColor: '#25D366', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 5 },
  btnText: { color: '#000', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#1e293b', height: 60, borderTopWidth: 1, borderColor: '#334155' },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { color: '#94a3b8', fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', padding: 20, borderRadius: 12 },
  modalTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 10, borderRadius: 6, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  adminBox: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10 },
  boxTitle: { color: '#00FF66', fontWeight: 'bold', marginBottom: 10 },
  bookingCard: { backgroundColor: '#0f172a', padding: 10, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  bookingText: { color: '#ccc', fontSize: 13 },
  roomBox: { backgroundColor: '#0f172a', padding: 15, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#25D366' },
  lockedBox: { backgroundColor: '#0f172a', padding: 15, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#ef4444', alignItems: 'center' },
  btnApprove: { backgroundColor: '#00FF66', padding: 8, borderRadius: 4, marginTop: 8, alignItems: 'center' }
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Linking } from 'react-native';

export default function App() {
  const [appTitle, setAppTitle] = useState("Gen Z Esports");
  const [bkashNumber, setBkashNumber] = useState("01816205692");
  const [nagadNumber, setNagadNumber] = useState("01816205692");
  const [adminPassword, setAdminPassword] = useState("1234");
  
  // WhatsApp Group Link (এখান থেকে পরিবর্তন করতে পারবেন)
  const [whatsappLink, setWhatsappLink] = useState("https://chat.whatsapp.com/ExampleGroupLink123");

  const [activeTab, setActiveTab] = useState('matches');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // টুর্নামেন্ট লিস্ট
  const [matches, setMatches] = useState([
    { 
      id: '1', 
      title: 'Free Fire Squad Battle #101', 
      fee: '50 Tk', 
      prize: '500 Tk', 
      time: '8:00 PM', 
      rules: '১. হ্যাকিং সম্পূর্ণ নিষিদ্ধ। ধরা পড়লে আজীবন ব্যান।\n২. হোয়াটসঅ্যাপ গ্রুপে নির্ধারিত সময়ের ১০ মিনিট আগে মেসেজ দেওয়া হবে।'
    },
    { 
      id: '2', 
      title: 'Free Fire Solo Clash #102', 
      fee: '20 Tk', 
      prize: '200 Tk', 
      time: '9:30 PM', 
      rules: '১. সোলো ম্যাচে টিম-আপ করা নিষেধ।\n২. এমুলেটর প্লেয়ার এলাউড না।'
    }
  ]);

  // বুকিং ডাটাবেজ
  const [bookings, setBookings] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [viewGroupMatch, setViewGroupMatch] = useState(null);

  // Form States
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerUid, setPlayerUid] = useState('');
  const [trxId, setTrxId] = useState('');

  // Admin Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newFee, setNewFee] = useState('');
  const [newPrize, setNewPrize] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newRules, setNewRules] = useState('');

  const handleLogin = () => {
    if (passInput === adminPassword) {
      setIsAdmin(true);
      setShowAuthModal(false);
      setPassInput('');
      setActiveTab('admin');
    } else {
      Alert.alert("Error", "ভুল পাসওয়ার্ড!");
    }
  };

  // স্লট বুকিং
  const handleConfirmBooking = () => {
    if (!teamName || !playerName || !playerUid || !trxId) {
      Alert.alert("Error", "সবগুলো তথ্য সঠিকভাবে পূরণ করুন!");
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      matchId: selectedMatch.id,
      matchTitle: selectedMatch.title,
      team: teamName,
      player: playerName,
      uid: playerUid,
      trx: trxId,
      status: 'pending' // পেন্ডিং থাকবে
    };

    setBookings([...bookings, newBooking]);
    Alert.alert("সফল হয়েছে!", "আপনার পেমেন্ট তথ্য জমা নেওয়া হয়েছে। অ্যাডমিন ভেরিফাই করলেই WhatsApp গ্রুপ লিংক আনলক হয়ে যাবে।");
    setSelectedMatch(null);
    setTeamName(''); setPlayerName(''); setPlayerUid(''); setTrxId('');
  };

  // পেমেন্ট অ্যাপ্রুভ (WhatsApp Link Unlock)
  const handleApproveBooking = (bookingId) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'approved' } : b));
    Alert.alert("Approved!", "এই প্লেয়ারের জন্য WhatsApp গ্রুপ লিংক আনলক করা হয়েছে।");
  };

  // নতুন ম্যাচ
  const handleAddMatch = () => {
    if (!newTitle || !newFee || !newPrize) {
      Alert.alert("Error", "ম্যাচ টাইটেল, এন্ট্রি ফি ও প্রাইজ প্রদান করুন!");
      return;
    }
    const item = {
      id: Date.now().toString(),
      title: newTitle,
      fee: newFee,
      prize: newPrize,
      time: newTime || 'TBA',
      rules: newRules || '১. ফেয়ার প্লে বজায় রাখুন।'
    };
    setMatches([...matches, item]);
    setNewTitle(''); setNewFee(''); setNewPrize(''); setNewTime(''); setNewRules('');
    Alert.alert("Success", "নতুন ম্যাচ যুক্ত করা হয়েছে!");
  };

  // পেমেন্ট ভেরিফাইড কিনা
  const checkUserVerified = (matchId) => {
    return bookings.some(b => b.matchId === matchId && b.status === 'approved');
  };

  // WhatsApp জয়েন করার ফাংশন
  const openWhatsAppGroup = () => {
    Linking.openURL(whatsappLink).catch(() => {
      Alert.alert("Error", "WhatsApp ওপেন করা যাচ্ছে না। আপনার ফোনে কি WhatsApp ইনস্টল করা আছে?");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>{appTitle}</Text>
      </View>

      <ScrollView style={styles.content}>
        
        {/* MATCHES LIST */}
        {activeTab === 'matches' && (
          <View>
            <Text style={styles.sectionTitle}>🔥 Active Matches</Text>
            {matches.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.matchTitle}>{item.title}</Text>
                <Text style={styles.detailText}>ফি: {item.fee} | প্রাইজ: {item.prize} | সময়: {item.time}</Text>
                
                <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                  <TouchableOpacity style={styles.btnPrimary} onPress={() => setSelectedMatch(item)}>
                    <Text style={styles.btnText}>Join / Book Slot</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.btnSecondary} onPress={() => setViewGroupMatch(item)}>
                    <Text style={{color:'#fff', fontWeight:'bold', fontSize: 12}}>💬 WhatsApp Group</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ADMIN CONTROL PANEL */}
        {activeTab === 'admin' && isAdmin && (
          <View>
            <Text style={styles.sectionTitle}>⚙️ Admin Control Panel</Text>

            {/* 1. WhatsApp Group Link Setup */}
            <View style={styles.adminBox}>
              <Text style={styles.boxTitle}>🔗 WhatsApp গ্রুপের লিংক সেটআপ করুন</Text>
              <TextInput style={styles.input} placeholder="WhatsApp Group Link (e.g. https://chat.whatsapp.com/...)" value={whatsappLink} onChangeText={setWhatsappLink} />
              <Text style={{color:'#aaa', fontSize: 11}}>প্লেয়ারদের টাকা ভেরিফাই করলে তারা অটোমেটিক এই লিংকে যুক্ত হতে পারবে।</Text>
            </View>

            {/* 2. Slot Verification */}
            <View style={[styles.adminBox, { marginTop: 15 }]}>
              <Text style={styles.boxTitle}>📋 স্লট বুকিং ও পেমেন্ট ভেরিফিকেশন</Text>
              {bookings.length === 0 ? <Text style={{color:'#888'}}>এখনো কোনো বুকিং জমা পড়েনি</Text> : null}
              {bookings.map(b => (
                <View key={b.id} style={styles.bookingCard}>
                  <Text style={styles.bookingText}>ম্যাচ: {b.matchTitle}</Text>
                  <Text style={styles.bookingText}>টিম: {b.team} | প্লেয়ার: {b.player}</Text>
                  <Text style={styles.bookingText}>UID: {b.uid}</Text>
                  <Text style={{color:'#00FF66'}}>TrxID: {b.trx}</Text>
                  <Text style={{color: b.status === 'approved' ? '#00FF66' : '#f59e0b', marginTop: 4}}>
                    Status: {b.status === 'approved' ? 'VERIFIED (LINK UNLOCKED)' : 'PENDING (LOCKED)'}
                  </Text>

                  {b.status === 'pending' && (
                    <TouchableOpacity style={styles.btnApprove} onPress={() => handleApproveBooking(b.id)}>
                      <Text style={{color:'#000', fontWeight:'bold', fontSize: 12}}>✅ Approve Payment (Unlock WA Link)</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* 3. Add New Match */}
            <View style={[styles.adminBox, { marginTop: 15 }]}>
              <Text style={styles.boxTitle}>➕ নতুন ম্যাচ যোগ করুন</Text>
              <TextInput style={styles.input} placeholder="Match Title" value={newTitle} onChangeText={setNewTitle} />
              <TextInput style={styles.input} placeholder="Fee (e.g. 50 Tk)" value={newFee} onChangeText={setNewFee} />
              <TextInput style={styles.input} placeholder="Prize (e.g. 500 Tk)" value={newPrize} onChangeText={setNewPrize} />
              <TextInput style={styles.input} placeholder="Time (e.g. 8:00 PM)" value={newTime} onChangeText={setNewTime} />
              <TextInput style={styles.input} placeholder="রুলস ও নিয়মাবলী" value={newRules} onChangeText={setNewRules} multiline />
              <TouchableOpacity style={styles.btnPrimary} onPress={handleAddMatch}>
                <Text style={styles.btnText}>+ Add Match</Text>
              </TouchableOpacity>
            </View>

            {/* 4. Settings */}
            <View style={[styles.adminBox, { marginTop: 15 }]}>
              <Text style={styles.boxTitle}>⚙️ সেটিংস কাস্টমাইজেশন</Text>
              <TextInput style={styles.input} placeholder="Bkash Number" value={bkashNumber} onChangeText={setBkashNumber} />
              <TextInput style={styles.input} placeholder="Nagad Number" value={nagadNumber} onChangeText={setNagadNumber} />
              <TextInput style={styles.input} placeholder="Change Admin Password" value={adminPassword} onChangeText={setAdminPassword} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('matches')}><Text style={styles.navText}>🎮 Matches</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => !isAdmin ? setShowAuthModal(true) : setActiveTab('admin')}><Text style={styles.navText}>🔒 Admin Panel</Text></TouchableOpacity>
      </View>

      {/* View WhatsApp Link Modal */}
      <Modal visible={!!viewGroupMatch} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💬 {viewGroupMatch?.title}</Text>
            
            {checkUserVerified(viewGroupMatch?.id) ? (
              <View style={styles.roomBox}>
                <Text style={{color:'#00FF66', fontWeight:'bold', marginBottom: 8}}>✅ পেমেন্ট ভেরিফাইড!</Text>
                <Text style={{color:'#ccc', fontSize: 13, marginBottom: 12}}>নিচের বাটনে ক্লিক করে টুর্নামেন্টের প্রাইভেট WhatsApp গ্রুপে জয়েন করুন। সেখানে রুম আইডি দেওয়া হবে।</Text>
                <TouchableOpacity style={styles.btnWhatsapp} onPress={openWhatsAppGroup}>
                  <Text style={{color:'#fff', fontWeight:'bold'}}>📲 Join WhatsApp Group</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.lockedBox}>
                <Text style={{color:'#ef4444', fontWeight:'bold', fontSize: 16, marginBottom: 5}}>🔒 Group Link Locked!</Text>
                <Text style={{color:'#cbd5e1', fontSize: 13, textAlign:'center'}}>
                  WhatsApp গ্রুপের লিংক পেতে প্রথমে পেমেন্ট সম্পন্ন করে স্লট বুক করুন। অ্যাডমিন আপনার পেমেন্ট ভেরিফাই করলেই লিংক আনলক হয়ে যাবে।
                </Text>
              </View>
            )}

            <View style={{marginTop: 15}}>
              <Text style={{color:'#00FF66', fontWeight:'bold', marginBottom:5}}>📜 ম্যাচের নিয়মাবলি:</Text>
              <Text style={{color:'#ccc', fontSize: 13, lineHeight: 18}}>{viewGroupMatch?.rules}</Text>
            </View>

            <TouchableOpacity style={[styles.btnPrimary, {marginTop: 15, width:'100%'}]} onPress={() => setViewGroupMatch(null)}>
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Slot Booking Form Modal */}
      <Modal visible={!!selectedMatch} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Slot Booking - {selectedMatch?.title}</Text>
            <Text style={{color:'#00FF66', marginBottom:8, fontWeight:'bold'}}>বিকাশ (Send Money): {bkashNumber} | নগদ: {nagadNumber}</Text>
            <TextInput style={styles.input} placeholder="Team Name" value={teamName} onChangeText={setTeamName} />
            <TextInput style={styles.input} placeholder="Player Name" value={playerName} onChangeText={setPlayerName} />
            <TextInput style={styles.input} placeholder="Free Fire UID" value={playerUid} onChangeText={setPlayerUid} />
            <TextInput style={styles.input} placeholder="Transaction ID (TrxID)" value={trxId} onChangeText={setTrxId} />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleConfirmBooking}><Text style={styles.btnText}>Submit & Pay</Text></TouchableOpacity>
            <TouchableOpacity style={{marginTop:10, alignItems:'center'}} onPress={() => setSelectedMatch(null)}><Text style={{color:'#888'}}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Admin Auth Modal */}
      <Modal visible={showAuthModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>অ্যাডমিন পাসওয়ার্ড দিন (Default: 1234)</Text>
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={passInput} onChangeText={setPassInput} />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}><Text style={styles.btnText}>Login</Text></TouchableOpacity>
            <TouchableOpacity style={{marginTop:10, alignItems:'center'}} onPress={() => setShowAuthModal(false)}><Text style={{color:'#888'}}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingTop: 40 },
  header: { alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderColor: '#1e293b' },
  logoText: { color: '#00FF66', fontSize: 22, fontWeight: 'bold' },
  content: { flex: 1, padding: 15 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, marginBottom: 15, borderLeftWidth: 4, borderColor: '#00FF66' },
  matchTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  detailText: { color: '#94a3b8', marginVertical: 3 },
  btnPrimary: { backgroundColor: '#00FF66', padding: 10, borderRadius: 6, alignItems: 'center', flex: 0.48 },
  btnSecondary: { backgroundColor: '#25D366', padding: 10, borderRadius: 6, alignItems: 'center', flex: 0.48 },
  btnWhatsapp: { backgroundColor: '#25D366', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 5 },
  btnText: { color: '#000', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#1e293b', height: 60, borderTopWidth: 1, borderColor: '#334155' },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { color: '#import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Linking } from 'react-native';

export default function App() {
  const [appTitle, setAppTitle] = useState("Gen Z Esports");
  const [bkashNumber, setBkashNumber] = useState("01816205692");
  const [nagadNumber, setNagadNumber] = useState("01816205692");
  const [adminPassword, setAdminPassword] = useState("1234");
  
  // WhatsApp Group Link (এখান থেকে পরিবর্তন করতে পারবেন)
  const [whatsappLink, setWhatsappLink] = useState("https://chat.whatsapp.com/ExampleGroupLink123");

  const [activeTab, setActiveTab] = useState('matches');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // টুর্নামেন্ট লিস্ট
  const [matches, setMatches] = useState([
    { 
      id: '1', 
      title: 'Free Fire Squad Battle #101', 
      fee: '50 Tk', 
      prize: '500 Tk', 
      time: '8:00 PM', 
      rules: '১. হ্যাকিং সম্পূর্ণ নিষিদ্ধ। ধরা পড়লে আজীবন ব্যান।\n২. হোয়াটসঅ্যাপ গ্রুপে নির্ধারিত সময়ের ১০ মিনিট আগে মেসেজ দেওয়া হবে।'
    },
    { 
      id: '2', 
      title: 'Free Fire Solo Clash #102', 
      fee: '20 Tk', 
      prize: '200 Tk', 
      time: '9:30 PM', 
      rules: '১. সোলো ম্যাচে টিম-আপ করা নিষেধ।\n২. এমুলেটর প্লেয়ার এলাউড না।'
    }
  ]);

  // বুকিং ডাটাবেজ
  const [bookings, setBookings] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [viewGroupMatch, setViewGroupMatch] = useState(null);

  // Form States
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerUid, setPlayerUid] = useState('');
  const [trxId, setTrxId] = useState('');

  // Admin Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newFee, setNewFee] = useState('');
  const [newPrize, setNewPrize] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newRules, setNewRules] = useState('');

  const handleLogin = () => {
    if (passInput === adminPassword) {
      setIsAdmin(true);
      setShowAuthModal(false);
      setPassInput('');
      setActiveTab('admin');
    } else {
      Alert.alert("Error", "ভুল পাসওয়ার্ড!");
    }
  };

  // স্লট বুকিং
  const handleConfirmBooking = () => {
    if (!teamName || !playerName || !playerUid || !trxId) {
      Alert.alert("Error", "সবগুলো তথ্য সঠিকভাবে পূরণ করুন!");
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      matchId: selectedMatch.id,
      matchTitle: selectedMatch.title,
      team: teamName,
      player: playerName,
      uid: playerUid,
      trx: trxId,
      status: 'pending' // পেন্ডিং থাকবে
    };

    setBookings([...bookings, newBooking]);
    Alert.alert("সফল হয়েছে!", "আপনার পেমেন্ট তথ্য জমা নেওয়া হয়েছে। অ্যাডমিন ভেরিফাই করলেই WhatsApp গ্রুপ লিংক আনলক হয়ে যাবে।");
    setSelectedMatch(null);
    setTeamName(''); setPlayerName(''); setPlayerUid(''); setTrxId('');
  };

  // পেমেন্ট অ্যাপ্রুভ (WhatsApp Link Unlock)
  const handleApproveBooking = (bookingId) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'approved' } : b));
    Alert.alert("Approved!", "এই প্লেয়ারের জন্য WhatsApp গ্রুপ লিংক আনলক করা হয়েছে।");
  };

  // নতুন ম্যাচ
  const handleAddMatch = () => {
    if (!newTitle || !newFee || !newPrize) {
      Alert.alert("Error", "ম্যাচ টাইটেল, এন্ট্রি ফি ও প্রাইজ প্রদান করুন!");
      return;
    }
    const item = {
      id: Date.now().toString(),
      title: newTitle,
      fee: newFee,
      prize: newPrize,
      time: newTime || 'TBA',
      rules: newRules || '১. ফেয়ার প্লে বজায় রাখুন।'
    };
    setMatches([...matches, item]);
    setNewTitle(''); setNewFee(''); setNewPrize(''); setNewTime(''); setNewRules('');
    Alert.alert("Success", "নতুন ম্যাচ যুক্ত করা হয়েছে!");
  };

  // পেমেন্ট ভেরিফাইড কিনা
  const checkUserVerified = (matchId) => {
    return bookings.some(b => b.matchId === matchId && b.status === 'approved');
  };

  // WhatsApp জয়েন করার ফাংশন
  const openWhatsAppGroup = () => {
    Linking.openURL(whatsappLink).catch(() => {
      Alert.alert("Error", "WhatsApp ওপেন করা যাচ্ছে না। আপনার ফোনে কি WhatsApp ইনস্টল করা আছে?");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>{appTitle}</Text>
      </View>

      <ScrollView style={styles.content}>
        
        {/* MATCHES LIST */}
        {activeTab === 'matches' && (
          <View>
            <Text style={styles.sectionTitle}>🔥 Active Matches</Text>
            {matches.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.matchTitle}>{item.title}</Text>
                <Text style={styles.detailText}>ফি: {item.fee} | প্রাইজ: {item.prize} | সময়: {item.time}</Text>
                
                <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                  <TouchableOpacity style={styles.btnPrimary} onPress={() => setSelectedMatch(item)}>
                    <Text style={styles.btnText}>Join / Book Slot</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.btnSecondary} onPress={() => setViewGroupMatch(item)}>
                    <Text style={{color:'#fff', fontWeight:'bold', fontSize: 12}}>💬 WhatsApp Group</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ADMIN CONTROL PANEL */}
        {activeTab === 'admin' && isAdmin && (
          <View>
            <Text style={styles.sectionTitle}>⚙️ Admin Control Panel</Text>

            {/* 1. WhatsApp Group Link Setup */}
            <View style={styles.adminBox}>
              <Text style={styles.boxTitle}>🔗 WhatsApp গ্রুপের লিংক সেটআপ করুন</Text>
              <TextInput style={styles.input} placeholder="WhatsApp Group Link (e.g. https://chat.whatsapp.com/...)" value={whatsappLink} onChangeText={setWhatsappLink} />
              <Text style={{color:'#aaa', fontSize: 11}}>প্লেয়ারদের টাকা ভেরিফাই করলে তারা অটোমেটিক এই লিংকে যুক্ত হতে পারবে।</Text>
            </View>

            {/* 2. Slot Verification */}
            <View style={[styles.adminBox, { marginTop: 15 }]}>
              <Text style={styles.boxTitle}>📋 স্লট বুকিং ও পেমেন্ট ভেরিফিকেশন</Text>
              {bookings.length === 0 ? <Text style={{color:'#888'}}>এখনো কোনো বুকিং জমা পড়েনি</Text> : null}
              {bookings.map(b => (
                <View key={b.id} style={styles.bookingCard}>
                  <Text style={styles.bookingText}>ম্যাচ: {b.matchTitle}</Text>
                  <Text style={styles.bookingText}>টিম: {b.team} | প্লেয়ার: {b.player}</Text>
                  <Text style={styles.bookingText}>UID: {b.uid}</Text>
                  <Text style={{color:'#00FF66'}}>TrxID: {b.trx}</Text>
                  <Text style={{color: b.status === 'approved' ? '#00FF66' : '#f59e0b', marginTop: 4}}>
                    Status: {b.status === 'approved' ? 'VERIFIED (LINK UNLOCKED)' : 'PENDING (LOCKED)'}
                  </Text>

                  {b.status === 'pending' && (
                    <TouchableOpacity style={styles.btnApprove} onPress={() => handleApproveBooking(b.id)}>
                      <Text style={{color:'#000', fontWeight:'bold', fontSize: 12}}>✅ Approve Payment (Unlock WA Link)</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* 3. Add New Match */}
            <View style={[styles.adminBox, { marginTop: 15 }]}>
              <Text style={styles.boxTitle}>➕ নতুন ম্যাচ যোগ করুন</Text>
              <TextInput style={styles.input} placeholder="Match Title" value={newTitle} onChangeText={setNewTitle} />
              <TextInput style={styles.input} placeholder="Fee (e.g. 50 Tk)" value={newFee} onChangeText={setNewFee} />
              <TextInput style={styles.input} placeholder="Prize (e.g. 500 Tk)" value={newPrize} onChangeText={setNewPrize} />
              <TextInput style={styles.input} placeholder="Time (e.g. 8:00 PM)" value={newTime} onChangeText={setNewTime} />
              <TextInput style={styles.input} placeholder="রুলস ও নিয়মাবলী" value={newRules} onChangeText={setNewRules} multiline />
              <TouchableOpacity style={styles.btnPrimary} onPress={handleAddMatch}>
                <Text style={styles.btnText}>+ Add Match</Text>
              </TouchableOpacity>
            </View>

            {/* 4. Settings */}
            <View style={[styles.adminBox, { marginTop: 15 }]}>
              <Text style={styles.boxTitle}>⚙️ সেটিংস কাস্টমাইজেশন</Text>
              <TextInput style={styles.input} placeholder="Bkash Number" value={bkashNumber} onChangeText={setBkashNumber} />
              <TextInput style={styles.input} placeholder="Nagad Number" value={nagadNumber} onChangeText={setNagadNumber} />
              <TextInput style={styles.input} placeholder="Change Admin Password" value={adminPassword} onChangeText={setAdminPassword} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('matches')}><Text style={styles.navText}>🎮 Matches</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => !isAdmin ? setShowAuthModal(true) : setActiveTab('admin')}><Text style={styles.navText}>🔒 Admin Panel</Text></TouchableOpacity>
      </View>

      {/* View WhatsApp Link Modal */}
      <Modal visible={!!viewGroupMatch} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💬 {viewGroupMatch?.title}</Text>
            
            {checkUserVerified(viewGroupMatch?.id) ? (
              <View style={styles.roomBox}>
                <Text style={{color:'#00FF66', fontWeight:'bold', marginBottom: 8}}>✅ পেমেন্ট ভেরিফাইড!</Text>
                <Text style={{color:'#ccc', fontSize: 13, marginBottom: 12}}>নিচের বাটনে ক্লিক করে টুর্নামেন্টের প্রাইভেট WhatsApp গ্রুপে জয়েন করুন। সেখানে রুম আইডি দেওয়া হবে।</Text>
                <TouchableOpacity style={styles.btnWhatsapp} onPress={openWhatsAppGroup}>
                  <Text style={{color:'#fff', fontWeight:'bold'}}>📲 Join WhatsApp Group</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.lockedBox}>
                <Text style={{color:'#ef4444', fontWeight:'bold', fontSize: 16, marginBottom: 5}}>🔒 Group Link Locked!</Text>
                <Text style={{color:'#cbd5e1', fontSize: 13, textAlign:'center'}}>
                  WhatsApp গ্রুপের লিংক পেতে প্রথমে পেমেন্ট সম্পন্ন করে স্লট বুক করুন। অ্যাডমিন আপনার পেমেন্ট ভেরিফাই করলেই লিংক আনলক হয়ে যাবে।
                </Text>
              </View>
            )}

            <View style={{marginTop: 15}}>
              <Text style={{color:'#00FF66', fontWeight:'bold', marginBottom:5}}>📜 ম্যাচের নিয়মাবলি:</Text>
              <Text style={{color:'#ccc', fontSize: 13, lineHeight: 18}}>{viewGroupMatch?.rules}</Text>
            </View>

            <TouchableOpacity style={[styles.btnPrimary, {marginTop: 15, width:'100%'}]} onPress={() => setViewGroupMatch(null)}>
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Slot Booking Form Modal */}
      <Modal visible={!!selectedMatch} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Slot Booking - {selectedMatch?.title}</Text>
            <Text style={{color:'#00FF66', marginBottom:8, fontWeight:'bold'}}>বিকাশ (Send Money): {bkashNumber} | নগদ: {nagadNumber}</Text>
            <TextInput style={styles.input} placeholder="Team Name" value={teamName} onChangeText={setTeamName} />
            <TextInput style={styles.input} placeholder="Player Name" value={playerName} onChangeText={setPlayerName} />
            <TextInput style={styles.input} placeholder="Free Fire UID" value={playerUid} onChangeText={setPlayerUid} />
            <TextInput style={styles.input} placeholder="Transaction ID (TrxID)" value={trxId} onChangeText={setTrxId} />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleConfirmBooking}><Text style={styles.btnText}>Submit & Pay</Text></TouchableOpacity>
            <TouchableOpacity style={{marginTop:10, alignItems:'center'}} onPress={() => setSelectedMatch(null)}><Text style={{color:'#888'}}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Admin Auth Modal */}
      <Modal visible={showAuthModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>অ্যাডমিন পাসওয়ার্ড দিন (Default: 1234)</Text>
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={passInput} onChangeText={setPassInput} />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}><Text style={styles.btnText}>Login</Text></TouchableOpacity>
            <TouchableOpacity style={{marginTop:10, alignItems:'center'}} onPress={() => setShowAuthModal(false)}><Text style={{color:'#888'}}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingTop: 40 },
  header: { alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderColor: '#1e293b' },
  logoText: { color: '#00FF66', fontSize: 22, fontWeight: 'bold' },
  content: { flex: 1, padding: 15 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, marginBottom: 15, borderLeftWidth: 4, borderColor: '#00FF66' },
  matchTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  detailText: { color: '#94a3b8', marginVertical: 3 },
  btnPrimary: { backgroundColor: '#00FF66', padding: 10, borderRadius: 6, alignItems: 'center', flex: 0.48 },
  btnSecondary: { backgroundColor: '#25D366', padding: 10, borderRadius: 6, alignItems: 'center', flex: 0.48 },
  btnWhatsapp: { backgroundColor: '#25D366', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 5 },
  btnText: { color: '#000', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#1e293b', height: 60, borderTopWidth: 1, borderColor: '#334155' },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { color: '#94a3b8', fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', padding: 20, borderRadius: 12 },
  modalTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 10, borderRadius: 6, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  adminBox: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10 },
  boxTitle: { color: '#00FF66', fontWeight: 'bold', marginBottom: 10 },
  bookingCard: { backgroundColor: '#0f172a', padding: 10, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  bookingText: { color: '#ccc', fontSize: 13 },
  roomBox: { backgroundColor: '#0f172a', padding: 15, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#25D366' },
  lockedBox: { backgroundColor: '#0f172a', padding: 15, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#ef4444', alignItems: 'center' },
  btnApprove: { backgroundColor: '#00FF66', padding: 8, borderRadius: 4, marginTop: 8, alignItems: 'center' }
});
94a3b8', fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', padding: 20, borderRadius: 12 },
  modalTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 10, borderRadius: 6, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  adminBox: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10 },
  boxTitle: { color: '#00FF66', fontWeight: 'bold', marginBottom: 10 },
  bookingCard: { backgroundColor: '#0f172a', padding: 10, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  bookingText: { color: '#ccc', fontSize: 13 },
  roomBox: { backgroundColor: '#0f172a', padding: 15, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#25D366' },
  lockedBox: { backgroundColor: '#0f172a', padding: 15, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#ef4444', alignItems: 'center' },
  btnApprove: { backgroundColor: '#00FF66', padding: 8, borderRadius: 4, marginTop: 8, alignItems: 'center' }
});

