import struct,zlib,collections
from pathlib import Path
def png(p):
 b=p.read_bytes();off=8;data=b'';meta=[]
 while off<len(b):
  n=struct.unpack('>I',b[off:off+4])[0];t=b[off+4:off+8];v=b[off+8:off+8+n];off+=n+12
  if t==b'IHDR':w,h,depth,color,_,_,interlace=struct.unpack('>IIBBBBB',v)
  elif t==b'IDAT':data+=v
  else:meta.append(t.decode())
 assert depth==8 and interlace==0 and color in (2,6),(depth,color,interlace)
 channels=3 if color==2 else 4;stride=w*channels;raw=zlib.decompress(data);rows=[];pos=0;prev=bytearray(stride)
 def paeth(a,b,c):
  q=a+b-c;d=[abs(q-a),abs(q-b),abs(q-c)];return [a,b,c][d.index(min(d))]
 for y in range(h):
  f=raw[pos];pos+=1;r=bytearray(raw[pos:pos+stride]);pos+=stride
  for i in range(stride):
   a=r[i-channels] if i>=channels else 0;bb=prev[i];c=prev[i-channels] if i>=channels else 0
   pred=[0,a,bb,(a+bb)//2,paeth(a,bb,c)][f];r[i]=(r[i]+pred)&255
  rows.append([tuple(r[i:i+channels]) for i in range(0,stride,channels)]);prev=r
 return w,h,rows,meta
if __name__=='__main__':
 import sys,json
 a=png(Path(sys.argv[1]));b=png(Path(sys.argv[2]));diff=[]
 if a[:2]==b[:2]:
  for y in range(a[1]):
   for x in range(a[0]):
    if a[2][y][x]!=b[2][y][x]:diff.append((x,y,a[2][y][x],b[2][y][x]))
 print(json.dumps({'sizes':[a[:2],b[:2]],'metadata':[a[3],b[3]],'different_pixels':len(diff),'colors_before':collections.Counter(c for r in a[2] for c in r).most_common(5),'colors_after':collections.Counter(c for r in b[2] for c in r).most_common(5),'diff_sample':diff[:6]}))
