import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, User, Clock, Send, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1); // Default to first conversation
  const [newMessage, setNewMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMessageToDelete, setSelectedMessageToDelete] = useState<number | null>(null);
  
  // Mock conversations data - in a real app, fetch this from your API
  const [conversations, setConversations] = useState([
    {
      id: 1,
      user: {
        name: "Jane Smith",
        avatar: "https://ui.shadcn.com/avatars/01.png",
        role: "Property Owner",
      },
      property: {
        id: 1,
        title: "Modern 2BHK Apartment",
      },
      lastMessage: "Is the apartment still available?",
      timestamp: "2024-02-10T14:30:00",
      unread: true,
      messages: [
        {
          id: 1,
          sender: "user",
          content: "Hi, I'm interested in your Modern 2BHK Apartment. Is it still available?",
          timestamp: "2024-02-10T14:30:00",
        },
        {
          id: 2,
          sender: "owner",
          content: "Yes, it's available. Would you like to schedule a viewing?",
          timestamp: "2024-02-10T15:45:00",
        },
        {
          id: 3,
          sender: "user",
          content: "That would be great. Is the apartment still available?",
          timestamp: "2024-02-10T16:20:00",
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Michael Johnson",
        avatar: "https://ui.shadcn.com/avatars/02.png",
        role: "Property Seeker",
      },
      property: {
        id: 2,
        title: "Spacious 3BHK Villa",
      },
      lastMessage: "When can I visit the property?",
      timestamp: "2024-02-09T10:15:00",
      unread: false,
      messages: [
        {
          id: 1,
          sender: "user",
          content: "Hello, I saw your listing for the 3BHK Villa and I'm very interested.",
          timestamp: "2024-02-08T09:30:00",
        },
        {
          id: 2,
          sender: "owner",
          content: "Hi Michael, thanks for your interest. The villa is available for viewing.",
          timestamp: "2024-02-08T11:45:00",
        },
        {
          id: 3,
          sender: "user",
          content: "Great! When can I visit the property?",
          timestamp: "2024-02-09T10:15:00",
        },
      ],
    },
  ]);

  const filteredConversations = conversations.filter(conversation => {
    // Filter by search query
    if (searchQuery && !conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !conversation.property.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === "unread" && !conversation.unread) {
      return false;
    }
    
    return true;
  });

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, send message to API
    setConversations(conversations.map(conversation => {
      if (conversation.id === selectedConversation) {
        return {
          ...conversation,
          lastMessage: newMessage,
          timestamp: new Date().toISOString(),
          messages: [
            ...conversation.messages,
            {
              id: conversation.messages.length + 1,
              sender: "owner", // Assuming current user is the owner
              content: newMessage,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return conversation;
    }));
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
    
    setNewMessage("");
  };

  const handleDeleteConversation = (id: number) => {
    setSelectedMessageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedMessageToDelete) {
      // In a real app, call API to delete conversation
      setConversations(conversations.filter(conversation => conversation.id !== selectedMessageToDelete));
      
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed",
      });
      
      if (selectedConversation === selectedMessageToDelete) {
        setSelectedConversation(conversations.length > 1 ? conversations[0].id : null);
      }
      
      setDeleteDialogOpen(false);
      setSelectedMessageToDelete(null);
    }
  };

  const markAsRead = (id: number) => {
    setConversations(conversations.map(conversation => {
      if (conversation.id === id) {
        return {
          ...conversation,
          unread: false,
        };
      }
      return conversation;
    }));
  };

  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
    markAsRead(id);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* Conversations List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inbox">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {conversations.filter(c => c.unread).length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {conversations.filter(c => c.unread).length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No matching conversations" : "No messages found"}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedConversation === conversation.id ? 'bg-secondary' : 'hover:bg-secondary/50'} ${conversation.unread ? 'border-l-4 border-primary' : ''}`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                      <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium truncate">{conversation.user.name}</h4>
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.timestamp)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-1 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(conversation.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{conversation.property.title}</p>
                      <p className="text-sm truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Conversation Detail */}
        <Card>
          {selectedConversationData ? (
            <>
              <CardHeader className="border-b p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedConversationData.user.avatar} alt={selectedConversationData.user.name} />
                    <AvatarFallback>{selectedConversationData.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{selectedConversationData.user.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversationData.user.role} • {selectedConversationData.property.title}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[calc(100vh-350px)]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversationData.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'owner' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'owner' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                      >
                        <p>{message.content}</p>
                        <div className="flex items-center justify-end mt-1 text-xs opacity-70">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTime(message.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Type your message..." 
                      value={newMessage} 
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Select a conversation from the list or start a new one by contacting property owners.
              </p>
            </CardContent>
          )}
        </Card>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;