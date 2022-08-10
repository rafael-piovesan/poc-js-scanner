FROM ubuntu:22.10 as yara
RUN apt-get update
RUN apt-get install -y yara yara-doc

FROM yara as scanner
RUN echo "yara -m /rules/*.yara -r /files > /files/report.txt" > script.sh
RUN chmod +x script.sh
CMD ["sh", "script.sh"]