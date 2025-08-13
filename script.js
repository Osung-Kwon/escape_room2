document.addEventListener('DOMContentLoaded', () => {

    // 퀴즈 데이터 정의
    const puzzles = {
        'area-blackboard': {
            title: '칠판 퀴즈',
            question: '교실에 보이는 의자는 총 몇 개일까요?',
            answer: '8',
            clue: '8',
            solved: false
        },
        'area-teacher-desk': {
            title: '교사용 책상 퀴즈',
            question: '선생님 책상 왼쪽에 쌓여있는 책은 몇 권인가요?',
            answer: '5',
            clue: '5',
            solved: false
        },
        'area-student-desk': {
            title: '학생 책상 퀴즈',
            question: '앞 책상 위에 놓인 필통은 몇 개인가요?',
            answer: '1',
            clue: '1',
            solved: false
        },
        'area-clock': {
            title: '시계 퀴즈',
            question: '수업 시작 전 \'0교시\'가 있는 날입니다. 지금은 몇 교시일까요?',
            answer: '0',
            clue: '0',
            solved: false
        }
    };

    let collectedClues = [];
    let currentPuzzleId = null;

    const puzzleModal = document.getElementById('puzzle-modal');
    const doorModal = document.getElementById('door-modal');
    const clueText = document.getElementById('clue-text');

    // 모든 클릭 영역에 이벤트 리스너 추가
    document.querySelectorAll('.clickable-area').forEach(area => {
        area.addEventListener('click', () => {
            const areaId = area.id;

            if (areaId === 'area-door') {
                handleDoorClick();
            } else if (puzzles[areaId] && !puzzles[areaId].solved) {
                openPuzzleModal(areaId);
            }
        });
    });

    // 퀴즈 모달 열기
    function openPuzzleModal(id) {
        currentPuzzleId = id;
        const puzzle = puzzles[id];
        
        document.getElementById('puzzle-title').textContent = puzzle.title;
        document.getElementById('puzzle-question').textContent = puzzle.question;
        document.getElementById('puzzle-answer').value = '';
        document.getElementById('puzzle-feedback').textContent = '';
        puzzleModal.style.display = 'block';
    }

    // 문 클릭 처리
    function handleDoorClick() {
        if (collectedClues.length < 4) {
            alert('아직 힌트를 전부 모으지 못했다. 교실을 더 둘러보자.');
            return;
        }
        document.getElementById('door-password').value = '';
        document.getElementById('door-feedback').textContent = '';
        doorModal.style.display = 'block';
    }

    // 퀴즈 정답 제출
    document.getElementById('puzzle-submit').addEventListener('click', () => {
        const userAnswer = document.getElementById('puzzle-answer').value.trim();
        const feedback = document.getElementById('puzzle-feedback');
        const puzzle = puzzles[currentPuzzleId];

        if (userAnswer === puzzle.answer) {
            feedback.textContent = `정답! 힌트 숫자 '${puzzle.clue}'을(를) 획득했습니다.`;
            feedback.style.color = 'green';
            
            puzzle.solved = true;
            document.getElementById(currentPuzzleId).classList.add('solved');
            
            if (!collectedClues.includes(puzzle.clue)) {
                collectedClues.push(puzzle.clue);
            }
            updateClueDisplay();

            setTimeout(() => {
                puzzleModal.style.display = 'none';
            }, 1500);

        } else {
            feedback.textContent = '틀렸습니다. 다시 생각해보세요.';
            feedback.style.color = 'red';
        }
    });

    // 탈출 비밀번호 제출
    document.getElementById('door-submit').addEventListener('click', () => {
        const password = document.getElementById('door-password').value.trim();
        const feedback = document.getElementById('door-feedback');
        const finalPassword = "0815";

        if (password === finalPassword) {
            feedback.textContent = '철컥! 문이 열렸다!';
            feedback.style.color = 'blue';
            setTimeout(() => {
                alert('축하합니다! 무사히 탈출했습니다!');
                doorModal.style.display = 'none';
                // 모든 상호작용 비활성화
                 document.querySelectorAll('.clickable-area').forEach(area => area.style.pointerEvents = 'none');
            }, 1000);
        } else {
            feedback.textContent = '비밀번호가 맞지 않습니다.';
            feedback.style.color = 'red';
        }
    });

    // 힌트 표시 업데이트
    function updateClueDisplay() {
        if (collectedClues.length === 0) {
            clueText.textContent = '아직 획득한 힌트가 없습니다.';
        } else {
            clueText.textContent = `숫자: [ ${collectedClues.join(', ')} ]`;
        }
    }

    // 모달 닫기 버튼
    document.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', () => {
            puzzleModal.style.display = 'none';
            doorModal.style.display = 'none';
        });
    });

    // 모달 바깥 영역 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target == puzzleModal || event.target == doorModal) {
            puzzleModal.style.display = 'none';
            doorModal.style.display = 'none';
        }
    });
});